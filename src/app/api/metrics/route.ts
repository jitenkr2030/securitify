import { NextRequest, NextResponse } from 'next/server';
import { systemMonitor, logger } from '@/lib/monitoring';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const metricName = searchParams.get('name');
    const timeRange = searchParams.get('timeRange'); // e.g., '1h', '24h', '7d'
    
    const metricsCollector = systemMonitor.getMetricsCollector();

    if (metricName) {
      // Return specific metric
      const timeRangeMs = parseTimeRange(timeRange || '1h');
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - timeRangeMs);
      
      const history = metricsCollector.getMetricHistory(metricName, { start: startTime, end: endTime });
      const aggregated = metricsCollector.getAggregatedMetrics(metricName, { start: startTime, end: endTime });
      
      return NextResponse.json({
        name: metricName,
        timeRange,
        history,
        aggregated,
        count: history.length,
      });
    } else {
      // Return all available metrics
      const allMetrics = metricsCollector.getAllMetrics();
      const systemStatus = await systemMonitor.getSystemStatus();
      
      return NextResponse.json({
        available_metrics: allMetrics,
        system_metrics: {
          uptime: systemStatus.metrics.uptime,
          memory: systemStatus.metrics.memory,
        },
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    logger.error('Metrics endpoint error', { error });
    
    return NextResponse.json({
      error: 'Failed to retrieve metrics',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

function parseTimeRange(timeRange: string): number {
  const unit = timeRange.slice(-1);
  const value = parseInt(timeRange.slice(0, -1));
  
  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 60 * 60 * 1000; // Default to 1 hour
  }
}