import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = await context.params;
    const tenantId = session.user.tenantId;

    // Check if geofence exists and belongs to tenant
    const existingGeofence = await db.geofence.findFirst({
      where: { id, tenantId },
    });

    if (!existingGeofence) {
      return NextResponse.json({ error: 'Geofence not found' }, { status: 404 });
    }

    const updatedGeofence = await db.geofence.update({
      where: { id },
      data: body,
      include: {
        post: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    return NextResponse.json(updatedGeofence);
  } catch (error) {
    console.error('Error updating geofence:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const tenantId = session.user.tenantId;

    // Check if geofence exists and belongs to tenant
    const existingGeofence = await db.geofence.findFirst({
      where: { id, tenantId },
    });

    if (!existingGeofence) {
      return NextResponse.json({ error: 'Geofence not found' }, { status: 404 });
    }

    await db.geofence.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Geofence deleted successfully' });
  } catch (error) {
    console.error('Error deleting geofence:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
