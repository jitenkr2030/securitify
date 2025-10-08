import { productionConfig } from './production-config';
import { performanceMonitor } from './cache';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  meta?: Record<string, any>;
  requestId?: string;
}

interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  latency: number;
  details?: Record<string, any>;
  timestamp: string;
}

interface MetricData {
  name: string;
  value: number;
  timestamp: string;
  tags?: Record<string, string>;
}

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'gt' | 'lt' | 'eq';
  threshold: number;
  duration: number; // in seconds
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

interface Alert {
  id: string;
  ruleId: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private generateRequestId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private formatLog(entry: LogEntry): string {
    const baseLog = {
      service: productionConfig.monitoring.serviceName,
      version: productionConfig.monitoring.version,
      environment: productionConfig.app.env,
      ...entry,
    };

    return JSON.stringify(baseLog);
  }

  private log(level: LogEntry['level'], message: string, meta?: Record<string, any>): void {
    if (!productionConfig.monitoring.enabled) {
      // Fallback to console logging in development
      const logMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[logMethod](`[${level.toUpperCase()}] ${message}`, meta || '');
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      requestId: this.generateRequestId(),
    };

    const formattedLog = this.formatLog(entry);
    
    // In production, this would send to a logging service
    // For now, we'll use console with structured logging
    console.log(formattedLog);
  }

  info(message: string, meta?: Record<string, any>): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: Record<string, any>): void {
    this.log('error', message, meta);
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.log('debug', message, meta);
  }

  // Performance monitoring
  async trackPerformance<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      
      this.info('Performance metric', {
        operation,
        duration,
        status: 'success',
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.error('Performance metric', {
        operation,
        duration,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  }

  // API request logging
  logApiRequest(method: string, url: string, statusCode: number, duration: number, userAgent?: string): void {
    this.info('API request', {
      method,
      url,
      statusCode,
      duration,
      userAgent,
    });
  }

  // Security event logging
  logSecurityEvent(event: string, details: Record<string, any>): void {
    this.warn('Security event', {
      event,
      ...details,
      timestamp: new Date().toISOString(),
    });
  }

  // Business event logging
  logBusinessEvent(event: string, tenantId: string, details: Record<string, any>): void {
    this.info('Business event', {
      event,
      tenantId,
      ...details,
    });
  }
}

export const logger = new Logger();

// Health Check System
export class HealthChecker {
  private checks: Map<string, () => Promise<HealthCheck>> = new Map();
  private results: Map<string, HealthCheck> = new Map();

  registerCheck(name: string, checkFn: () => Promise<HealthCheck>): void {
    this.checks.set(name, checkFn);
  }

  async runCheck(name: string): Promise<HealthCheck> {
    const checkFn = this.checks.get(name);
    if (!checkFn) {
      throw new Error(`Health check '${name}' not found`);
    }

    try {
      const result = await checkFn();
      this.results.set(name, result);
      return result;
    } catch (error) {
      const failedResult: HealthCheck = {
        name,
        status: 'unhealthy',
        latency: 0,
        timestamp: new Date().toISOString(),
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      };
      this.results.set(name, failedResult);
      return failedResult;
    }
  }

  async runAllChecks(): Promise<HealthCheck[]> {
    const results: HealthCheck[] = [];
    
    for (const [name] of this.checks) {
      try {
        const result = await this.runCheck(name);
        results.push(result);
      } catch (error) {
        logger.error(`Health check failed for ${name}`, { error });
      }
    }
    
    return results;
  }

  getOverallStatus(): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Array.from(this.results.values()).map(r => r.status);
    
    if (statuses.every(s => s === 'healthy')) {
      return 'healthy';
    }
    
    if (statuses.some(s => s === 'unhealthy')) {
      return 'unhealthy';
    }
    
    return 'degraded';
  }

  getCheckResults(): HealthCheck[] {
    return Array.from(this.results.values());
  }
}

// Metrics Collection System
export class MetricsCollector {
  private metrics: Map<string, MetricData[]> = new Map();
  private aggregationInterval: number = 60000; // 1 minute

  recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    const metric: MetricData = {
      name,
      value,
      timestamp: new Date().toISOString(),
      tags,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name)!.push(metric);
    
    // Keep only last 1000 data points per metric
    const data = this.metrics.get(name)!;
    if (data.length > 1000) {
      this.metrics.set(name, data.slice(-1000));
    }
  }

  getMetricHistory(name: string, timeRange?: { start: Date; end: Date }): MetricData[] {
    const data = this.metrics.get(name) || [];
    
    if (!timeRange) {
      return data;
    }
    
    return data.filter(metric => {
      const metricTime = new Date(metric.timestamp);
      return metricTime >= timeRange.start && metricTime <= timeRange.end;
    });
  }

  getAggregatedMetrics(name: string, timeRange: { start: Date; end: Date }): {
    count: number;
    min: number;
    max: number;
    avg: number;
    sum: number;
  } | null {
    const data = this.getMetricHistory(name, timeRange);
    
    if (data.length === 0) {
      return null;
    }
    
    const values = data.map(d => d.value);
    const sum = values.reduce((acc, val) => acc + val, 0);
    
    return {
      count: values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: sum / values.length,
      sum,
    };
  }

  getAllMetrics(): string[] {
    return Array.from(this.metrics.keys());
  }

  clearMetrics(name?: string): void {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }
}

// Alerting System
export class AlertManager {
  private rules: Map<string, AlertRule> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private metricStates: Map<string, { value: number; timestamp: number; count: number }> = new Map();
  private metricsCollector: MetricsCollector;

  constructor(metricsCollector: MetricsCollector) {
    this.metricsCollector = metricsCollector;
    this.startAlertEvaluation();
  }

  addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
  }

  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  getRules(): AlertRule[] {
    return Array.from(this.rules.values());
  }

  getActiveAlerts(): Alert[] {
    return Array.from(this.alerts.values()).filter(alert => !alert.resolved);
  }

  getAlertHistory(): Alert[] {
    return Array.from(this.alerts.values());
  }

  resolveAlert(alertId: string): void {
    const alert = this.alerts.get(alertId);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
      logger.info('Alert resolved', { alertId, ruleId: alert.ruleId });
    }
  }

  private startAlertEvaluation(): void {
    // Evaluate alerts every 30 seconds
    setInterval(() => {
      this.evaluateAlerts();
    }, 30000);
  }

  private evaluateAlerts(): void {
    const now = Date.now();
    
    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;

      const recentMetrics = this.metricsCollector.getMetricHistory(rule.metric, {
        start: new Date(now - rule.duration * 1000),
        end: new Date(now),
      });

      if (recentMetrics.length === 0) continue;

      const latestMetric = recentMetrics[recentMetrics.length - 1];
      const isTriggered = this.checkCondition(latestMetric.value, rule.condition, rule.threshold);

      if (isTriggered) {
        const stateKey = `${rule.id}_${rule.metric}`;
        const currentState = this.metricStates.get(stateKey) || { value: 0, timestamp: 0, count: 0 };
        
        if (now - currentState.timestamp > rule.duration * 1000) {
          // Reset count if duration has passed
          currentState.count = 1;
        } else {
          currentState.count++;
        }
        
        currentState.value = latestMetric.value;
        currentState.timestamp = now;
        this.metricStates.set(stateKey, currentState);

        // Trigger alert if condition persists for the duration
        if (currentState.count >= Math.ceil(rule.duration / 30)) { // 30 second evaluation interval
          this.triggerAlert(rule, latestMetric.value);
        }
      } else {
        // Reset state if condition is not met
        const stateKey = `${rule.id}_${rule.metric}`;
        this.metricStates.delete(stateKey);
        
        // Resolve any existing alerts for this rule
        const existingAlert = Array.from(this.alerts.values())
          .find(alert => alert.ruleId === rule.id && !alert.resolved);
        
        if (existingAlert) {
          this.resolveAlert(existingAlert.id);
        }
      }
    }
  }

  private checkCondition(value: number, condition: string, threshold: number): boolean {
    switch (condition) {
      case 'gt':
        return value > threshold;
      case 'lt':
        return value < threshold;
      case 'eq':
        return value === threshold;
      default:
        return false;
    }
  }

  private triggerAlert(rule: AlertRule, currentValue: number): void {
    const existingAlert = Array.from(this.alerts.values())
      .find(alert => alert.ruleId === rule.id && !alert.resolved);

    if (existingAlert) {
      // Alert already exists, don't create duplicate
      return;
    }

    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ruleId: rule.id,
      message: `${rule.name}: ${rule.metric} ${rule.condition} ${rule.threshold} (current: ${currentValue})`,
      severity: rule.severity,
      timestamp: new Date().toISOString(),
      resolved: false,
      metadata: {
        currentValue,
        threshold: rule.threshold,
        condition: rule.condition,
      },
    };

    this.alerts.set(alert.id, alert);
    
    logger.warn('Alert triggered', {
      alertId: alert.id,
      ruleId: rule.id,
      severity: alert.severity,
      message: alert.message,
    });

    // Here you could add integrations with external alerting systems
    // like Slack, email, PagerDuty, etc.
  }
}

// System Monitor - Main monitoring coordinator
export class SystemMonitor {
  private healthChecker: HealthChecker;
  private metricsCollector: MetricsCollector;
  private alertManager: AlertManager;
  private startTime: Date = new Date();

  constructor() {
    this.healthChecker = new HealthChecker();
    this.metricsCollector = new MetricsCollector();
    this.alertManager = new AlertManager(this.metricsCollector);
    
    this.setupDefaultHealthChecks();
    this.setupDefaultAlertRules();
    this.startPeriodicMetricsCollection();
  }

  private setupDefaultHealthChecks(): void {
    // Database health check
    this.healthChecker.registerCheck('database', async () => {
      const start = Date.now();
      
      try {
        // This would use your actual database client
        // For now, we'll simulate it
        await new Promise(resolve => setTimeout(resolve, 10));
        const latency = Date.now() - start;
        
        return {
          name: 'database',
          status: latency < 1000 ? 'healthy' : latency < 5000 ? 'degraded' : 'unhealthy',
          latency,
          timestamp: new Date().toISOString(),
          details: { latency, connections: Math.floor(Math.random() * 10) + 1 },
        };
      } catch (error) {
        return {
          name: 'database',
          status: 'unhealthy',
          latency: Date.now() - start,
          timestamp: new Date().toISOString(),
          details: { error: error instanceof Error ? error.message : 'Unknown error' },
        };
      }
    });

    // Memory health check
    this.healthChecker.registerCheck('memory', async () => {
      const start = Date.now();
      const memUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
      const usagePercent = (heapUsedMB / heapTotalMB) * 100;
      
      return {
        name: 'memory',
        status: usagePercent < 80 ? 'healthy' : usagePercent < 95 ? 'degraded' : 'unhealthy',
        latency: Date.now() - start,
        timestamp: new Date().toISOString(),
        details: {
          heapUsedMB,
          heapTotalMB,
          usagePercent: Math.round(usagePercent * 100) / 100,
        },
      };
    });

    // API health check
    this.healthChecker.registerCheck('api', async () => {
      const start = Date.now();
      
      try {
        // Simulate API check
        await new Promise(resolve => setTimeout(resolve, 5));
        const latency = Date.now() - start;
        
        return {
          name: 'api',
          status: latency < 500 ? 'healthy' : latency < 2000 ? 'degraded' : 'unhealthy',
          latency,
          timestamp: new Date().toISOString(),
          details: { latency },
        };
      } catch (error) {
        return {
          name: 'api',
          status: 'unhealthy',
          latency: Date.now() - start,
          timestamp: new Date().toISOString(),
          details: { error: error instanceof Error ? error.message : 'Unknown error' },
        };
      }
    });
  }

  private setupDefaultAlertRules(): void {
    const defaultRules: AlertRule[] = [
      {
        id: 'high_memory_usage',
        name: 'High Memory Usage',
        metric: 'memory_usage_percent',
        condition: 'gt',
        threshold: 90,
        duration: 300, // 5 minutes
        severity: 'high',
        enabled: true,
      },
      {
        id: 'high_response_time',
        name: 'High Response Time',
        metric: 'api_response_time',
        condition: 'gt',
        threshold: 2000,
        duration: 300, // 5 minutes
        severity: 'medium',
        enabled: true,
      },
      {
        id: 'database_latency',
        name: 'Database Latency',
        metric: 'database_latency',
        condition: 'gt',
        threshold: 1000,
        duration: 180, // 3 minutes
        severity: 'medium',
        enabled: true,
      },
      {
        id: 'error_rate',
        name: 'High Error Rate',
        metric: 'error_rate',
        condition: 'gt',
        threshold: 5,
        duration: 300, // 5 minutes
        severity: 'high',
        enabled: true,
      },
    ];

    defaultRules.forEach(rule => this.alertManager.addRule(rule));
  }

  private startPeriodicMetricsCollection(): void {
    // Collect system metrics every 30 seconds
    setInterval(() => {
      this.collectSystemMetrics();
    }, 30000);
  }

  private collectSystemMetrics(): void {
    // Memory metrics
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    const usagePercent = (heapUsedMB / heapTotalMB) * 100;

    this.metricsCollector.recordMetric('memory_heap_used_mb', heapUsedMB);
    this.metricsCollector.recordMetric('memory_heap_total_mb', heapTotalMB);
    this.metricsCollector.recordMetric('memory_usage_percent', usagePercent);

    // Uptime
    const uptime = Date.now() - this.startTime.getTime();
    this.metricsCollector.recordMetric('system_uptime_ms', uptime);

    // Performance metrics from cache
    const perfMetrics = performanceMonitor.getAllMetrics();
    for (const [name, stats] of Object.entries(perfMetrics)) {
      this.metricsCollector.recordMetric(`${name}_avg`, stats.avg);
      this.metricsCollector.recordMetric(`${name}_max`, stats.max);
      this.metricsCollector.recordMetric(`${name}_count`, stats.count);
    }
  }

  // Public API
  getHealthChecker(): HealthChecker {
    return this.healthChecker;
  }

  getMetricsCollector(): MetricsCollector {
    return this.metricsCollector;
  }

  getAlertManager(): AlertManager {
    return this.alertManager;
  }

  async getSystemStatus(): Promise<{
    health: {
      overall: string;
      checks: HealthCheck[];
    };
    metrics: {
      uptime: number;
      memory: {
        heapUsedMB: number;
        heapTotalMB: number;
        usagePercent: number;
      };
    };
    alerts: {
      active: number;
      total: number;
      recent: Alert[];
    };
  }> {
    const healthChecks = await this.healthChecker.runAllChecks();
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    const usagePercent = (heapUsedMB / heapTotalMB) * 100;
    const uptime = Date.now() - this.startTime.getTime();

    return {
      health: {
        overall: this.healthChecker.getOverallStatus(),
        checks: healthChecks,
      },
      metrics: {
        uptime,
        memory: {
          heapUsedMB,
          heapTotalMB,
          usagePercent: Math.round(usagePercent * 100) / 100,
        },
      },
      alerts: {
        active: this.alertManager.getActiveAlerts().length,
        total: this.alertManager.getAlertHistory().length,
        recent: this.alertManager.getAlertHistory().slice(-10),
      },
    };
  }
}

// Global system monitor instance
export const systemMonitor = new SystemMonitor();

// Error tracking utility
export class ErrorTracker {
  static trackError(error: Error, context?: Record<string, any>): void {
    logger.error('Uncaught error', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
    });
  }

  static trackApiError(error: Error, endpoint: string, method: string, statusCode: number): void {
    logger.error('API error', {
      message: error.message,
      endpoint,
      method,
      statusCode,
      stack: error.stack,
    });
  }
}

// Performance monitoring utility
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  static recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  static getMetricStats(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    
    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / values.length,
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  static resetMetrics(): void {
    this.metrics.clear();
  }
}