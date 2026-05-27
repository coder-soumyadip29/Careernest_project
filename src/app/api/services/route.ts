import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdminRole } from '@/lib/auth-utils';

const SERVICES_COLLECTION = 'services';

// GET - Fetch all services (public)
export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Database is not configured' },
        { status: 500 }
      );
    }

    const servicesSnapshot = await adminDb.collection(SERVICES_COLLECTION).get();
    const services = servicesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST - Create a new service (admin only)
export async function POST(request: Request) {
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

    const body = await request.json();
    const { title, description, icon, features } = body;

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const newService = {
      title,
      description,
      icon: icon || null,
      features: features || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection(SERVICES_COLLECTION).add(newService);

    return NextResponse.json({
      success: true,
      service: {
        id: docRef.id,
        ...newService,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
