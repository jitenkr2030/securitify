import { NextRequest, NextResponse } from 'next/server';
import { systemMonitor, logger } from '@/lib/monitoring';

export async function GET(request: NextRequest) {
  try {
    // Get system status
    const systemStatus = await systemMonitor.getSystemStatus();
    
    // Get alert manager
    const alertManager = systemMonitor.getAlertManager();
    
    // Get metrics collector
    const metricsCollector = systemMonitor.getMetricsCollector();
    
    // Calculate summary metrics
    const summary = {
      // System Overview
      system: {
        status: systemStatus.health.overall,
        uptime: systemStatus.metrics.uptime,
        uptimeFormatted: formatUptime(systemStatus.metrics.uptime),
        version: '1.0.0',
        lastUpdated: new Date().toISOString()
      },
      
      // Health Summary
      health: {
        overall: systemStatus.health.overall,
        checks: {
          total: systemStatus.health.checks.length,
          healthy: systemStatus.health.checks.filter(c => c.status === 'healthy').length,
          degraded: systemStatus.health.checks.filter(c => c.status === 'degraded').length,
          unhealthy: systemStatus.health.checks.filter(c => c.status === 'unhealthy').length
        },
        score: calculateHealthScore(systemStatus.health.checks)
      },
      
      // Resource Usage
      resources: {
        memory: {
          usage: systemStatus.metrics.memory.usagePercent,
          status: getResourceStatus(systemStatus.metrics.memory.usagePercent, 80, 95),
          available: systemStatus.metrics.memory.heapTotalMB - systemStatus.metrics.memory.heapUsedMB,
          total: systemStatus.metrics.memory.heapTotalMB
        },
        cpu: {
          usage: await getCurrentCPUUsage(),
          status: getResourceStatus(await getCurrentCPUUsage(), 70, 90),
          cores: 4 // Mock value
        },
        disk: {
          usage: await getDiskUsage(),
          status: getResourceStatus(await getDiskUsage(), 80, 90),
          available: await getAvailableDiskSpace(),
          total: await getTotalDiskSpace()
        }
      },
      
      // Application Performance
      performance: {
        responseTime: {
          current: await getCurrentResponseTime(),
          status: getPerformanceStatus(await getCurrentResponseTime(), 1000, 2000),
          p95: await getPercentile('api_response_time', 95),
          p99: await getPercentile('api_response_time', 99)
        },
        throughput: {
          current: await getCurrentThroughput(),
          status: getThroughputStatus(await getCurrentThroughput())
        },
        errorRate: {
          current: await getCurrentErrorRate(),
          status: getErrorRateStatus(await getCurrentErrorRate())
        },
        availability: {
          current: calculateAvailability(),
          status: getAvailabilityStatus(calculateAvailability())
        }
      },
      
      // Database Status
      database: {
        status: 'healthy', // Would check actual database health
        connections: {
          active: await getActiveDatabaseConnections(),
          idle: await getIdleDatabaseConnections(),
          waiting: await getWaitingDatabaseConnections(),
          max: 20 // Mock value
        },
        performance: {
          queryTime: await getCurrentQueryTime(),
          status: getQueryTimeStatus(await getCurrentQueryTime())
        }
      },
      
      // Alerts Summary
      alerts: {
        total: alertManager.getActiveAlerts().length,
        bySeverity: {
          critical: alertManager.getActiveAlerts().filter(a => a.severity === 'critical').length,
          high: alertManager.getActiveAlerts().filter(a => a.severity === 'high').length,
          medium: alertManager.getActiveAlerts().filter(a => a.severity === 'medium').length,
          low: alertManager.getActiveAlerts().filter(a => a.severity === 'low').length
        },
        recent: alertManager.getAlertHistory().slice(-5)
      },
      
      // User Activity
      users: {
        active: await getActiveUserCount(),
        sessions: await getActiveSessionCount(),
        newToday: await getNewUserCount(
          new Date(new Date().setHours(0, 0, 0, 0)),
          new Date()
        )
      },
      
      // Recent Activity
      activity: {
        recentEvents: await getRecentActivity(),
        topEndpoints: await getTopEndpoints(
          new Date(Date.now() - 24 * 60 * 60 * 1000),
          new Date()
        )
      }
    };
    
    return NextResponse.json(summary);
  } catch (error) {
    logger.error('Monitoring summary error', { error });
    
    return NextResponse.json({
      error: 'Failed to retrieve monitoring summary',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Helper functions
function formatUptime(uptimeMs: number): string {
  const days = Math.floor(uptimeMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((uptimeMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((uptimeMs % (60 * 60 * 1000)) / (60 * 1000));
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

function calculateHealthScore(checks: any[]): number {
  if (checks.length === 0) return 100;
  
  const healthyWeight = 3;
  const degradedWeight = 1;
  const unhealthyWeight = 0;
  
  let totalScore = 0;
  let maxScore = 0;
  
  for (const check of checks) {
    maxScore += healthyWeight;
    
    switch (check.status) {
      case 'healthy':
        totalScore += healthyWeight;
        break;
      case 'degraded':
        totalScore += degradedWeight;
        break;
      case 'unhealthy':
        totalScore += unhealthyWeight;
        break;
    }
  }
  
  return Math.round((totalScore / maxScore) * 100);
}

function getResourceStatus(usage: number, warningThreshold: number, criticalThreshold: number): 'good' | 'warning' | 'critical' {
  if (usage >= criticalThreshold) return 'critical';
  if (usage >= warningThreshold) return 'warning';
  return 'good';
}

function getPerformanceStatus(responseTime: number, warningThreshold: number, criticalThreshold: number): 'good' | 'warning' | 'critical' {
  if (responseTime >= criticalThreshold) return 'critical';
  if (responseTime >= warningThreshold) return 'warning';
  return 'good';
}

function getThroughputStatus(throughput: number): 'good' | 'warning' | 'critical' {
  if (throughput < 10) return 'critical';
  if (throughput < 50) return 'warning';
  return 'good';
}

function getErrorRateStatus(errorRate: number): 'good' | 'warning' | 'critical' {
  if (errorRate > 5) return 'critical';
  if (errorRate > 1) return 'warning';
  return 'good';
}

function calculateAvailability(): number {
  // Mock implementation - would calculate from actual metrics
  return 99.9;
}

function getAvailabilityStatus(availability: number): 'good' | 'warning' | 'critical' {
  if (availability < 99) return 'critical';
  if (availability < 99.9) return 'warning';
  return 'good';
}

function getQueryTimeStatus(queryTime: number): 'good' | 'warning' | 'critical' {
  if (queryTime > 1000) return 'critical';
  if (queryTime > 500) return 'warning';
  return 'good';
}

// Mock implementations for system metrics
async function getCurrentCPUUsage(): Promise<number> {
  return Math.random() * 100;
}

async function getDiskUsage(): Promise<number> {
  return Math.random() * 100;
}

async function getAvailableDiskSpace(): Promise<number> {
  return Math.random() * 1000; // GB
}

async function getTotalDiskSpace(): Promise<number> {
  return 2000; // GB
}

async function getCurrentResponseTime(): Promise<number> {
  return Math.random() * 2000;
}

async function getPercentile(metricName: string, percentile: number): Promise<number> {
  return Math.random() * 2000;
}

async function getCurrentThroughput(): Promise<number> {
  return Math.random() * 1000;
}

async function getCurrentErrorRate(): Promise<number> {
  return Math.random() * 10;
}

async function getActiveDatabaseConnections(): Promise<number> {
  return Math.floor(Math.random() * 20);
}

async function getIdleDatabaseConnections(): Promise<number> {
  return Math.floor(Math.random() * 10);
}

async function getWaitingDatabaseConnections(): Promise<number> {
  return Math.floor(Math.random() * 5);
}

async function getCurrentQueryTime(): Promise<number> {
  return Math.random() * 500;
}

async function getActiveUserCount(): Promise<number> {
  return Math.floor(Math.random() * 100);
}

async function getActiveSessionCount(): Promise<number> {
  return Math.floor(Math.random() * 50);
}

async function getNewUserCount(startTime: Date, endTime: Date): Promise<number> {
  return Math.floor(Math.random() * 20);
}

async function getRecentActivity(): Promise<Array<{ type: string; message: string; timestamp: Date }>> {
  return [
    { type: 'user_login', message: 'User logged in', timestamp: new Date() },
    { type: 'alert_created', message: 'New alert created', timestamp: new Date() },
    { type: 'backup_completed', message: 'Backup completed successfully', timestamp: new Date() }
  ];
}

async function getTopEndpoints(startTime: Date, endTime: Date): Promise<Array<{ endpoint: string; count: number }>> {
  return [
    { endpoint: '/api/guards', count: 150 },
    { endpoint: '/api/alerts', count: 120 },
    { endpoint: '/api/attendance', count: 100 }
  ];
}