import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');

    let whereClause: any = {};
    
    if (severity) {
      whereClause.severity = severity;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const alerts = await db.alert.findMany({
      where: whereClause,
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true,
            photo: true
          }
        },
        location: {
          select: {
            latitude: true,
            longitude: true,
            timestamp: true
          }
        },
        geofence: {
          select: {
            name: true,
            radius: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, message, severity, guardId, locationId, geofenceId, userId } = body;

    const alert = await db.alert.create({
      data: {
        type,
        message,
        severity,
        guardId,
        locationId,
        geofenceId,
        userId
      },
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true,
            photo: true
          }
        },
        location: {
          select: {
            latitude: true,
            longitude: true,
            timestamp: true
          }
        },
        geofence: {
          select: {
            name: true,
            radius: true
          }
        }
      }
    });

    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const alert = await db.alert.update({
      where: { id },
      data: { status },
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true,
            photo: true
          }
        },
        location: {
          select: {
            latitude: true,
            longitude: true,
            timestamp: true
          }
        },
        geofence: {
          select: {
            name: true,
            radius: true
          }
        }
      }
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}