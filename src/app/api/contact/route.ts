import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdminRole } from '@/lib/auth-utils';

const CONTACT_COLLECTION = 'contact_inquiries';

// GET - Fetch all contact inquiries (admin only)
export async function GET() {
  try {
    // Verify admin role
    const isAdmin = await verifyAdminRole();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    if (!adminDb) {
      return NextResponse.json(
        { error: 'Database is not configured' },
        { status: 500 }
      );
    }

    const inquiriesSnapshot = await adminDb
      .collection(CONTACT_COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();

    const inquiries = inquiriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact inquiries' },
      { status: 500 }
    );
  }
}

// POST - Submit a contact inquiry (public)
export async function POST(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Database is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const newInquiry = {
      name,
      email,
      phone: phone || null,
      subject: subject || 'General Inquiry',
      message,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection(CONTACT_COLLECTION).add(newInquiry);

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been submitted successfully',
      inquiryId: docRef.id,
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting contact inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
