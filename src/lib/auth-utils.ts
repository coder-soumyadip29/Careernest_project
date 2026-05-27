import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

const SESSION_COOKIE_NAME = 'session';
const SESSION_EXPIRY_MS = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

export interface SessionUser {
  uid: string;
  email: string | undefined;
  name: string | undefined;
  picture: string | undefined;
  isAdmin: boolean;
}

/**
 * Creates a session cookie from a Firebase ID token
 */
export async function createSessionCookie(idToken: string): Promise<string> {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth is not initialized');
  }

  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRY_MS,
  });

  return sessionCookie;
}

/**
 * Sets the session cookie in the response
 */
export async function setSessionCookie(sessionCookie: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_EXPIRY_MS / 1000, // Convert to seconds
    path: '/',
  });
}

/**
 * Clears the session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Gets the session cookie value
 */
export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Verifies the session cookie and returns the decoded token
 */
export async function verifySessionCookie(): Promise<DecodedIdToken | null> {
  if (!adminAuth) {
    console.error('Firebase Admin Auth is not initialized');
    return null;
  }

  const sessionCookie = await getSessionCookie();
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}

/**
 * Gets the current authenticated user from the session
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const decodedToken = await verifySessionCookie();
  if (!decodedToken) {
    return null;
  }

  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
    name: decodedToken.name,
    picture: decodedToken.picture,
    isAdmin: decodedToken.admin === true,
  };
}

/**
 * Verifies if the current user has admin role
 */
export async function verifyAdminRole(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.isAdmin === true;
}

/**
 * Sets custom claims for a user (e.g., admin role)
 */
export async function setUserClaims(uid: string, claims: Record<string, unknown>): Promise<void> {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth is not initialized');
  }

  await adminAuth.setCustomUserClaims(uid, claims);
}
