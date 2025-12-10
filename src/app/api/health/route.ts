import { NextRequest, NextResponse } from 'next/server';
import { systemMonitor, logger } from '@/lib/monitoring';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';

    // Get system status
    const systemStatus = await systemMonitor.getSystemStatus();

    if (detailed) {
      // Return detailed health information
      return NextResponse.json({
        status: systemStatus.health.overall,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: systemStatus.metrics.uptime,
        health: systemStatus.health,
        metrics: systemStatus.metrics,
        alerts: systemStatus.alerts,
      });
    } else {
      // Return simple health status
      const isHealthy = systemStatus.health.overall === 'healthy';
      
      return NextResponse.json({
        status: systemStatus.health.overall,
        timestamp: new Date().toISOString(),
        uptime: systemStatus.metrics.uptime,
        checks: systemStatus.health.checks.length,
        active_alerts: systemStatus.alerts.active,
      }, {
        status: isHealthy ? 200 : 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }
  } catch (error) {
    logger.error('Health check endpoint error', { error });
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Internal server error',
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}