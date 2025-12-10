import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const { searchParams } = new URL(request.url);
    const geofenceId = searchParams.get('geofenceId');

    // Get geofences for the tenant
    const geofences = await db.geofence.findMany({
      where: { tenantId },
      include: {
        alerts: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        },
      },
    });

    // Calculate analytics
    const analytics = geofences.map(geofence => {
      const alerts = geofence.alerts;
      const totalBreaches = alerts.length;
      const activeBreaches = alerts.filter(a => a.status !== "resolved").length;

      // Calculate average response time (mock data for now)
      const averageResponseTime = Math.random() * 10 + 2; // 2-12 minutes

      // Find most active guard
      const guardCounts = alerts.reduce((acc, alert) => {
        acc[alert.guardId] = (acc[alert.guardId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostActiveGuardId = Object.entries(guardCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0];

      const mostActiveGuard = mostActiveGuardId ? "Unknown Guard" : "Unknown";

      // Determine breach trend (mock calculation)
      const recentBreaches = alerts.filter(a => 
        new Date(a.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length;
      const trend = recentBreaches > totalBreaches * 0.5 ? "increasing" : "stable";

      return {
        geofenceId: geofence.id,
        geofenceName: geofence.name,
        totalBreaches,
        activeBreaches,
        averageResponseTime: Math.round(averageResponseTime * 100) / 100,
        mostActiveGuard,
        trend,
        riskLevel: activeBreaches > 5 ? "high" : activeBreaches > 2 ? "medium" : "low",
      };
    });

    // Filter by specific geofence if requested
    const filteredAnalytics = geofenceId 
      ? analytics.filter(a => a.geofenceId === geofenceId)
      : analytics;

    return NextResponse.json(filteredAnalytics);

  } catch (error) {
    console.error('Error fetching geofence analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
