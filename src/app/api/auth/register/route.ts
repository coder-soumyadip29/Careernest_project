import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { createSessionCookie, setSessionCookie } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin is not configured' },
        { status: 500 }
      );
    }

    const { idToken, name } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Optionally update the user's display name if provided
    if (name) {
      await adminAuth.updateUser(decodedToken.uid, {
        displayName: name,
      });
    }

    // Create session cookie
    const sessionCookie = await createSessionCookie(idToken);
    await setSessionCookie(sessionCookie);

    return NextResponse.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: name || decodedToken.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 401 }
    );
  }
}
