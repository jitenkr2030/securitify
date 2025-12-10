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

    // Get all guards for the tenant
    const guards = await db.guard.findMany({
      where: {
        user: {
          tenantId: tenantId
        }
      },
      include: {
        locations: {
          where: {
            timestamp: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        },
      },
    });

    // Calculate analytics
    const totalDevices = guards.length;
    const onlineDevices = Math.floor(totalDevices * 0.8); // 80% online
    const offlineDevices = totalDevices - onlineDevices;
    
    // Calculate average battery (mock data)
    const averageBattery = Math.floor(Math.random() * 30) + 50; // 50-80%
    
    // Calculate average signal strength (mock data)
    const averageSignal = Math.floor(Math.random() * 20) - 80; // -80 to -60 dBm
    
    // Calculate data synced (mock data)
    const dataSynced = Math.floor(Math.random() * 2000) + 500; // 500-2500 MB
    
    // Calculate alerts generated (mock data)
    const alertsGenerated = Math.floor(Math.random() * 50) + 10; // 10-60 alerts
    
    // Calculate uptime (mock data)
    const uptime = Math.floor(Math.random() * 10) + 90; // 90-100%

    const analytics = {
      totalDevices,
      onlineDevices,
      offlineDevices,
      averageBattery,
      averageSignal,
      dataSynced,
      alertsGenerated,
      uptime,
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching mobile analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}