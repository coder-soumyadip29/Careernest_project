import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdminRole } from '@/lib/auth-utils';

const SERVICES_COLLECTION = 'services';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT - Update a service (admin only)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    const docRef = adminDb.collection(SERVICES_COLLECTION).doc(id);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, description, icon, features } = body;

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (features !== undefined) updateData.features = features;

    await docRef.update(updateData);

    const updatedDoc = await docRef.get();

    return NextResponse.json({
      success: true,
      service: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a service (admin only)
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

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

    const docRef = adminDb.collection(SERVICES_COLLECTION).doc(id);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
