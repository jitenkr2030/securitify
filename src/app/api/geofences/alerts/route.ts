import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = session.user.tenantId;
    const status = searchParams.get('status') || 'all';

    const whereClause: any = { tenantId };
    if (status !== 'all') {
      whereClause.isResolved = status === 'resolved';
    }

    const alerts = await db.geofenceAlert.findMany({
      where: whereClause,
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            photo: true,
          },
        },
        geofence: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching geofence alerts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      guardId,
      geofenceId,
      type,
      message,
      severity,
      latitude,
      longitude,
    } = body;

    const tenantId = session.user.tenantId;

    // Validate required fields
    if (!guardId || !geofenceId || !type || !severity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if guard and geofence exist and belong to tenant
    const guard = await db.guard.findFirst({
      where: { id: guardId },
    });

    if (!guard) {
      return NextResponse.json({ error: 'Guard not found' }, { status: 404 });
    }

    const geofence = await db.geofence.findFirst({
      where: { id: geofenceId, tenantId },
    });

    if (!geofence) {
      return NextResponse.json({ error: 'Geofence not found' }, { status: 404 });
    }

    const alert = await db.geofenceAlert.create({
      data: {
        guardId,
        geofenceId,
        tenantId,
        type,
        message: message || `${type} alert for ${guard.name}`,
        severity,
        latitude,
        longitude,
        isResolved: false,
      },
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            photo: true,
          },
        },
        geofence: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error creating geofence alert:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}