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

    const tenantId = session.user.tenantId;

    // Get all guards for the tenant to simulate mobile devices
    const guards = await db.guard.findMany({
      where: {
        user: {
          tenantId: tenantId
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        locations: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
    });

    // Transform guard data to mobile device format
    const devices = guards.map(guard => ({
      id: guard.id,
      guardName: guard.name,
      deviceModel: "Mobile Device", // Mock data
      osVersion: "Latest", // Mock data
      appVersion: "2.1.0",
      batteryLevel: Math.floor(Math.random() * 100) + 1, // Mock battery level
      isCharging: Math.random() > 0.8, // Mock charging status
      lastSync: guard.locations[0]?.timestamp || new Date().toISOString(),
      isOnline: Math.random() > 0.2, // 80% online
      locationEnabled: true,
      gpsAccuracy: Math.random() * 10 + 1, // 1-11 meters
      signalStrength: Math.floor(Math.random() * 40) - 90, // -90 to -50 dBm
      dataUsage: {
        upload: Math.floor(Math.random() * 500) + 50, // 50-550 MB
        download: Math.floor(Math.random() * 1000) + 100, // 100-1100 MB
      },
      storage: {
        used: Math.random() * 6 + 1, // 1-7 GB used
        total: 8.0, // 8 GB total
      },
      features: {
        offlineMode: true,
        backgroundTracking: Math.random() > 0.3, // 70% enabled
        emergencySOS: true,
        pushNotifications: true,
        biometricAuth: Math.random() > 0.4, // 60% enabled
      },
    }));

    return NextResponse.json(devices);
  } catch (error) {
    console.error('Error fetching mobile devices:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}