import { NextRequest, NextResponse } from 'next/server';
import { systemMonitor, logger } from '@/lib/monitoring';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '1h'; // 1h, 24h, 7d, 30d
    
    // Get comprehensive system status
    const systemStatus = await systemMonitor.getSystemStatus();
    
    // Get additional metrics for dashboard
    const metricsCollector = systemMonitor.getMetricsCollector();
    const alertManager = systemMonitor.getAlertManager();
    
    // Calculate time range for metrics
    const timeRangeMs = parseTimeRange(timeRange);
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - timeRangeMs);
    
    // Get dashboard metrics
    const dashboardData = {
      overview: {
        status: systemStatus.health.overall,
        uptime: systemStatus.metrics.uptime,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      },
      
      health: {
        overall: systemStatus.health.overall,
        checks: systemStatus.health.checks,
        summary: {
          healthy: systemStatus.health.checks.filter(c => c.status === 'healthy').length,
          degraded: systemStatus.health.checks.filter(c => c.status === 'degraded').length,
          unhealthy: systemStatus.health.checks.filter(c => c.status === 'unhealthy').length
        }
      },
      
      metrics: {
        system: {
          memory: {
            current: systemStatus.metrics.memory,
            history: await getMetricHistory('memory_usage_percent', startTime, endTime),
            trends: calculateTrends(await getMetricHistory('memory_usage_percent', startTime, endTime))
          },
          cpu: {
            current: await getCurrentCPUUsage(),
            history: await getMetricHistory('cpu_usage', startTime, endTime),
            trends: calculateTrends(await getMetricHistory('cpu_usage', startTime, endTime))
          },
          disk: {
            current: await getDiskUsage(),
            history: await getMetricHistory('disk_usage', startTime, endTime),
            trends: calculateTrends(await getMetricHistory('disk_usage', startTime, endTime))
          }
        },
        
        application: {
          responseTime: {
            current: await getCurrentResponseTime(),
            history: await getMetricHistory('api_response_time', startTime, endTime),
            trends: calculateTrends(await getMetricHistory('api_response_time', startTime, endTime)),
            p95: await getPercentile('api_response_time', 95, startTime, endTime),
            p99: await getPercentile('api_response_time', 99, startTime, endTime)
          },
          throughput: {
            current: await getCurrentThroughput(),
            history: await getMetricHistory('api_requests_per_minute', startTime, endTime),
            trends: calculateTrends(await getMetricHistory('api_requests_per_minute', startTime, endTime))
          },
          errorRate: {
            current: await getCurrentErrorRate(),
            history: await getMetricHistory('error_rate', startTime, endTime),
            trends: calculateTrends(await getMetricHistory('error_rate', startTime, endTime))
          }
        },
        
        database: {
          connections: {
            active: await getActiveDatabaseConnections(),
            idle: await getIdleDatabaseConnections(),
            waiting: await getWaitingDatabaseConnections()
          },
          queryTime: {
            current: await getCurrentQueryTime(),
            history: await getMetricHistory('database_query_time', startTime, endTime),
            trends: calculateTrends(await getMetricHistory('database_query_time', startTime, endTime))
          },
          slowQueries: await getSlowQueryCount(startTime, endTime)
        }
      },
      
      alerts: {
        active: alertManager.getActiveAlerts(),
        summary: {
          critical: alertManager.getActiveAlerts().filter(a => a.severity === 'critical').length,
          high: alertManager.getActiveAlerts().filter(a => a.severity === 'high').length,
          medium: alertManager.getActiveAlerts().filter(a => a.severity === 'medium').length,
          low: alertManager.getActiveAlerts().filter(a => a.severity === 'low').length
        },
        recent: alertManager.getAlertHistory().slice(-10)
      },
      
      performance: {
        topEndpoints: await getTopEndpoints(startTime, endTime),
        slowEndpoints: await getSlowEndpoints(startTime, endTime),
        errorEndpoints: await getErrorEndpoints(startTime, endTime)
      },
      
      users: {
        active: await getActiveUserCount(),
        sessions: await getActiveSessionCount(),
        newUsers: await getNewUserCount(startTime, endTime)
      }
    };
    
    return NextResponse.json(dashboardData);
  } catch (error) {
    logger.error('Monitoring dashboard error', { error });
    
    return NextResponse.json({
      error: 'Failed to retrieve dashboard data',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Helper functions
async function getMetricHistory(metricName: string, startTime: Date, endTime: Date) {
  // This would integrate with your metrics collector
  // For now, return mock data
  return [];
}

function calculateTrends(history: any[]) {
  if (history.length < 2) return { direction: 'stable', change: 0 };
  
  const recent = history.slice(-5);
  const older = history.slice(-10, -5);
  
  if (older.length === 0) return { direction: 'stable', change: 0 };
  
  const recentAvg = recent.reduce((sum: number, item: any) => sum + item.value, 0) / recent.length;
  const olderAvg = older.reduce((sum: number, item: any) => sum + item.value, 0) / older.length;
  
  const change = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  let direction = 'stable';
  if (change > 5) direction = 'increasing';
  else if (change < -5) direction = 'decreasing';
  
  return { direction, change: Math.round(change * 100) / 100 };
}

async function getCurrentCPUUsage(): Promise<number> {
  // Mock implementation
  return Math.random() * 100;
}

async function getDiskUsage(): Promise<number> {
  // Mock implementation
  return Math.random() * 100;
}

async function getCurrentResponseTime(): Promise<number> {
  // Mock implementation
  return Math.random() * 2000;
}

async function getCurrentThroughput(): Promise<number> {
  // Mock implementation
  return Math.random() * 1000;
}

async function getCurrentErrorRate(): Promise<number> {
  // Mock implementation
  return Math.random() * 10;
}

async function getPercentile(metricName: string, percentile: number, startTime: Date, endTime: Date): Promise<number> {
  // Mock implementation
  return Math.random() * 2000;
}

async function getActiveDatabaseConnections(): Promise<number> {
  // Mock implementation
  return Math.floor(Math.random() * 20);
}

async function getIdleDatabaseConnections(): Promise<number> {
  // Mock implementation
  return Math.floor(Math.random() * 10);
}

async function getWaitingDatabaseConnections(): Promise<number> {
  // Mock implementation
  return Math.floor(Math.random() * 5);
}

async function getCurrentQueryTime(): Promise<number> {
  // Mock implementation
  return Math.random() * 500;
}

async function getSlowQueryCount(startTime: Date, endTime: Date): Promise<number> {
  // Mock implementation
  return Math.floor(Math.random() * 10);
}

async function getTopEndpoints(startTime: Date, endTime: Date): Promise<Array<{ endpoint: string; count: number }>> {
  // Mock implementation
  return [
    { endpoint: '/api/guards', count: 150 },
    { endpoint: '/api/alerts', count: 120 },
    { endpoint: '/api/attendance', count: 100 }
  ];
}

async function getSlowEndpoints(startTime: Date, endTime: Date): Promise<Array<{ endpoint: string; avgTime: number }>> {
  // Mock implementation
  return [
    { endpoint: '/api/reports', avgTime: 2500 },
    { endpoint: '/api/analytics', avgTime: 1800 }
  ];
}

async function getErrorEndpoints(startTime: Date, endTime: Date): Promise<Array<{ endpoint: string; errorCount: number }>> {
  // Mock implementation
  return [
    { endpoint: '/api/upload', errorCount: 5 },
    { endpoint: '/api/payment', errorCount: 3 }
  ];
}

async function getActiveUserCount(): Promise<number> {
  // Mock implementation
  return Math.floor(Math.random() * 100);
}

async function getActiveSessionCount(): Promise<number> {
  // Mock implementation
  return Math.floor(Math.random() * 50);
}

async function getNewUserCount(startTime: Date, endTime: Date): Promise<number> {
  // Mock implementation
  return Math.floor(Math.random() * 20);
}

function parseTimeRange(timeRange: string): number {
  const unit = timeRange.slice(-1);
  const value = parseInt(timeRange.slice(0, -1));
  
  switch (unit) {
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 60 * 60 * 1000; // Default to 1 hour
  }
}