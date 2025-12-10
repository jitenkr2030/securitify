import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const guardId = searchParams.get('guardId');
    const limit = searchParams.get('limit') || '10';

    let whereClause: any = {};
    
    if (guardId) {
      whereClause.guardId = guardId;
    }

    const locations = await db.location.findMany({
      where: whereClause,
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: parseInt(limit)
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude, speed, direction, guardId, userId } = body;

    const location = await db.location.create({
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        speed: speed ? parseFloat(speed) : null,
        direction: direction ? parseFloat(direction) : null,
        guardId,
        userId
      },
      include: {
        guard: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      }
    });

    // Check for geofence breaches
    await checkGeofenceBreaches(guardId, parseFloat(latitude), parseFloat(longitude), userId);

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
}

async function checkGeofenceBreaches(guardId: string, latitude: number, longitude: number, userId: string) {
  try {
    // Get guard's current shift
    const currentShift = await db.shift.findFirst({
      where: {
        guardId,
        status: 'in_progress'
      },
      include: {
        post: {
          include: {
            geofences: true
          }
        }
      }
    });

    if (!currentShift || !currentShift.post.geofences.length) {
      return;
    }

    // Check each geofence
    for (const geofence of currentShift.post.geofences) {
      const distance = calculateDistance(
        latitude,
        longitude,
        geofence.latitude,
        geofence.longitude
      );

      if (distance > geofence.radius) {
        // Create geofence breach alert
        await db.alert.create({
          data: {
            type: 'geofence_breach',
            message: `Guard has left the designated area: ${geofence.name}`,
            severity: 'high',
            guardId,
            geofenceId: geofence.id,
            userId
          }
        });
      }
    }
  } catch (error) {
    console.error('Error checking geofence breaches:', error);
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Return distance in meters
}