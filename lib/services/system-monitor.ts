import { prisma } from '@/lib/prisma';
import { AuditService } from './audit-service';
import { searchService } from './search-service';
import { backupService } from './backup-service';
import { notificationService } from './notification-service';
import * as os from 'os';
import * as fs from 'fs/promises';

export interface SystemHealth {
  overall: 'healthy' | 'warning' | 'critical';
  score: number; // 0-100
  lastChecked: Date;
  components: {
    database: ComponentHealth;
    api: ComponentHealth;
    storage: ComponentHealth;
    memory: ComponentHealth;
    cpu: ComponentHealth;
    network: ComponentHealth;
    modules: Record<string, ComponentHealth>;
  };
  alerts: SystemAlert[];
}

export interface ComponentHealth {
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  score: number;
  metrics: Record<string, any>;
  lastCheck: Date;
  responseTime?: number;
  errorRate?: number;
  uptime?: number;
  message?: string;
}

export interface SystemAlert {
  id: string;
  type: 'performance' | 'error' | 'security' | 'capacity' | 'backup';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  component: string;
  metrics: Record<string, any>;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedAt?: Date;
  actions: string[];
}

export interface PerformanceMetrics {
  timestamp: Date;
  cpu: {
    usage: number;
    loadAverage: number[];
    cores: number;
  };
  memory: {
    used: number;
    free: number;
    total: number;
    percentage: number;
  };
  storage: {
    used: number;
    free: number;
    total: number;
    percentage: number;
  };
  database: {
    connections: number;
    activeQueries: number;
    avgQueryTime: number;
    slowQueries: number;
  };
  api: {
    requestsPerMinute: number;
    averageResponseTime: number;
    errorRate: number;
    activeConnections: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    connections: number;
    latency: number;
  };
}

export interface SystemStats {
  uptime: number;
  startTime: Date;
  version: string;
  environment: string;
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  dataSize: number;
  backupSize: number;
  errorCount: number;
  moduleStatus: Record<string, {
    status: string;
    lastActivity: Date;
    errorCount: number;
    activeUsers: number;
  }>;
}

export class SystemMonitor {
  private static instance: SystemMonitor;
  private alerts: Map<string, SystemAlert> = new Map();
  private metrics: PerformanceMetrics[] = [];
  private thresholds = {
    cpu: { warning: 70, critical: 90 },
    memory: { warning: 80, critical: 95 },
    storage: { warning: 85, critical: 95 },
    database: { warning: 80, critical: 95 },
    api: {
      responseTime: { warning: 1000, critical: 3000 },
      errorRate: { warning: 5, critical: 10 }
    }
  };

  constructor() {
    this.startMonitoring();
    this.setupAlertProcessing();
  }

  static getInstance(): SystemMonitor {
    if (!SystemMonitor.instance) {
      SystemMonitor.instance = new SystemMonitor();
    }
    return SystemMonitor.instance;
  }

  // Get current system health
  async getSystemHealth(): Promise<SystemHealth> {
    try {
      const components = await this.checkAllComponents();
      const alerts = this.getActiveAlerts();

      // Calculate overall score
      const componentScores = Object.values(components).map(c => c.score);
      const averageScore = componentScores.reduce((sum, score) => sum + score, 0) / componentScores.length;

      // Determine overall status
      let overall: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (averageScore < 50 || alerts.some(a => a.severity === 'critical')) {
        overall = 'critical';
      } else if (averageScore < 80 || alerts.some(a => a.severity === 'high')) {
        overall = 'warning';
      }

      return {
        overall,
        score: Math.round(averageScore),
        lastChecked: new Date(),
        components,
        alerts
      };
    } catch (error) {
      console.error('System health check error:', error);
      return {
        overall: 'critical',
        score: 0,
        lastChecked: new Date(),
        components: {} as any,
        alerts: [{
          id: 'health_check_error',
          type: 'error',
          severity: 'critical',
          title: 'Health Check Failed',
          message: 'Unable to perform system health check',
          component: 'monitor',
          metrics: { error: error.message },
          timestamp: new Date(),
          acknowledged: false,
          resolved: false,
          actions: ['Check system logs', 'Restart monitoring service']
        }]
      };
    }
  }

  // Get performance metrics
  async getPerformanceMetrics(timeRange?: {
    start: Date;
    end: Date;
  }): Promise<PerformanceMetrics[]> {
    try {
      if (timeRange) {
        return this.metrics.filter(m =>
          m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
        );
      }

      // Return last 24 hours by default
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return this.metrics.filter(m => m.timestamp >= yesterday);
    } catch (error) {
      console.error('Get performance metrics error:', error);
      return [];
    }
  }

  // Get system statistics
  async getSystemStats(): Promise<SystemStats> {
    try {
      const [
        totalUsers,
        activeUsers,
        totalTransactions,
        errorCount
      ] = await Promise.all([
        prisma.user.count(),
        this.getActiveUsersCount(),
        this.getTotalTransactionsCount(),
        this.getErrorCount()
      ]);

      const dataSize = await this.calculateDataSize();
      const backupStats = await backupService.getBackupStats();
      const moduleStatus = await this.getModuleStatus();

      return {
        uptime: process.uptime(),
        startTime: new Date(Date.now() - process.uptime() * 1000),
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        totalUsers,
        activeUsers,
        totalTransactions,
        dataSize,
        backupSize: backupStats.totalSize,
        errorCount,
        moduleStatus
      };
    } catch (error) {
      console.error('Get system stats error:', error);
      return {
        uptime: 0,
        startTime: new Date(),
        version: '1.0.0',
        environment: 'unknown',
        totalUsers: 0,
        activeUsers: 0,
        totalTransactions: 0,
        dataSize: 0,
        backupSize: 0,
        errorCount: 0,
        moduleStatus: {}
      };
    }
  }

  // Get system alerts
  getSystemAlerts(filters?: {
    type?: string;
    severity?: string;
    component?: string;
    unacknowledged?: boolean;
  }): SystemAlert[] {
    let alerts = Array.from(this.alerts.values());

    if (filters) {
      if (filters.type) {
        alerts = alerts.filter(a => a.type === filters.type);
      }
      if (filters.severity) {
        alerts = alerts.filter(a => a.severity === filters.severity);
      }
      if (filters.component) {
        alerts = alerts.filter(a => a.component === filters.component);
      }
      if (filters.unacknowledged) {
        alerts = alerts.filter(a => !a.acknowledged);
      }
    }

    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Acknowledge alert
  async acknowledgeAlert(alertId: string, userId: string): Promise<boolean> {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.acknowledged = true;
    alert.acknowledgedBy = userId;
    alert.acknowledgedAt = new Date();

    await AuditService.logActivity({
      userId,
      action: 'alert_acknowledged',
      module: 'system_monitor',
      details: { alertId, alertType: alert.type, component: alert.component },
      timestamp: new Date()
    });

    return true;
  }

  // Resolve alert
  async resolveAlert(alertId: string, userId: string): Promise<boolean> {
    const alert = this.alerts.get(alertId);
    if (!alert) return false;

    alert.resolved = true;
    alert.resolvedAt = new Date();

    await AuditService.logActivity({
      userId,
      action: 'alert_resolved',
      module: 'system_monitor',
      details: { alertId, alertType: alert.type, component: alert.component },
      timestamp: new Date()
    });

    return true;
  }

  // Test specific component
  async testComponent(component: string): Promise<ComponentHealth> {
    switch (component) {
      case 'database':
        return await this.checkDatabaseHealth();
      case 'api':
        return await this.checkAPIHealth();
      case 'storage':
        return await this.checkStorageHealth();
      case 'memory':
        return await this.checkMemoryHealth();
      case 'cpu':
        return await this.checkCPUHealth();
      case 'network':
        return await this.checkNetworkHealth();
      default:
        return await this.checkModuleHealth(component);
    }
  }

  // Private methods
  private startMonitoring(): void {
    // Collect metrics every minute
    setInterval(async () => {
      await this.collectMetrics();
    }, 60000);

    // Health check every 5 minutes
    setInterval(async () => {
      await this.performHealthCheck();
    }, 300000);

    // Cleanup old metrics every hour
    setInterval(() => {
      this.cleanupOldMetrics();
    }, 3600000);
  }

  private async collectMetrics(): Promise<void> {
    try {
      const metrics: PerformanceMetrics = {
        timestamp: new Date(),
        cpu: await this.getCPUMetrics(),
        memory: await this.getMemoryMetrics(),
        storage: await this.getStorageMetrics(),
        database: await this.getDatabaseMetrics(),
        api: await this.getAPIMetrics(),
        network: await this.getNetworkMetrics()
      };

      this.metrics.push(metrics);

      // Check for threshold violations
      await this.checkThresholds(metrics);
    } catch (error) {
      console.error('Metrics collection error:', error);
    }
  }

  private async performHealthCheck(): Promise<void> {
    try {
      const health = await this.getSystemHealth();

      // Log health status
      await AuditService.logActivity({
        userId: 'system',
        action: 'health_check_performed',
        module: 'system_monitor',
        details: {
          overall: health.overall,
          score: health.score,
          alertCount: health.alerts.length
        },
        timestamp: new Date()
      });

      // Send notifications for critical issues
      if (health.overall === 'critical') {
        await this.notifyCriticalHealth(health);
      }
    } catch (error) {
      console.error('Health check error:', error);
    }
  }

  private async checkAllComponents(): Promise<SystemHealth['components']> {
    const [database, api, storage, memory, cpu, network] = await Promise.all([
      this.checkDatabaseHealth(),
      this.checkAPIHealth(),
      this.checkStorageHealth(),
      this.checkMemoryHealth(),
      this.checkCPUHealth(),
      this.checkNetworkHealth()
    ]);

    const modules = await this.checkAllModules();

    return {
      database,
      api,
      storage,
      memory,
      cpu,
      network,
      modules
    };
  }

  private async checkDatabaseHealth(): Promise<ComponentHealth> {
    const startTime = Date.now();

    try {
      // Test database connection
      await prisma.$queryRaw`SELECT 1`;

      const responseTime = Date.now() - startTime;

      // Get database metrics
      const metrics = await this.getDatabaseMetrics();

      let status: ComponentHealth['status'] = 'healthy';
      let score = 100;

      if (metrics.connections > this.thresholds.database.critical) {
        status = 'critical';
        score = 20;
      } else if (metrics.connections > this.thresholds.database.warning) {
        status = 'warning';
        score = 60;
      }

      if (responseTime > 5000) {
        status = 'critical';
        score = Math.min(score, 20);
      } else if (responseTime > 1000) {
        status = 'warning';
        score = Math.min(score, 60);
      }

      return {
        status,
        score,
        metrics,
        lastCheck: new Date(),
        responseTime
      };
    } catch (error) {
      return {
        status: 'offline',
        score: 0,
        metrics: {},
        lastCheck: new Date(),
        responseTime: Date.now() - startTime,
        message: error.message
      };
    }
  }

  private async checkAPIHealth(): Promise<ComponentHealth> {
    try {
      const metrics = await this.getAPIMetrics();

      let status: ComponentHealth['status'] = 'healthy';
      let score = 100;

      if (metrics.errorRate > this.thresholds.api.errorRate.critical) {
        status = 'critical';
        score = 20;
      } else if (metrics.errorRate > this.thresholds.api.errorRate.warning) {
        status = 'warning';
        score = 60;
      }

      if (metrics.averageResponseTime > this.thresholds.api.responseTime.critical) {
        status = 'critical';
        score = Math.min(score, 20);
      } else if (metrics.averageResponseTime > this.thresholds.api.responseTime.warning) {
        status = 'warning';
        score = Math.min(score, 60);
      }

      return {
        status,
        score,
        metrics,
        lastCheck: new Date(),
        responseTime: metrics.averageResponseTime,
        errorRate: metrics.errorRate
      };
    } catch (error) {
      return {
        status: 'offline',
        score: 0,
        metrics: {},
        lastCheck: new Date(),
        message: error.message
      };
    }
  }

  private async checkStorageHealth(): Promise<ComponentHealth> {
    try {
      const metrics = await this.getStorageMetrics();

      let status: ComponentHealth['status'] = 'healthy';
      let score = 100;

      if (metrics.percentage > this.thresholds.storage.critical) {
        status = 'critical';
        score = 20;
      } else if (metrics.percentage > this.thresholds.storage.warning) {
        status = 'warning';
        score = 60;
      }

      return {
        status,
        score,
        metrics,
        lastCheck: new Date()
      };
    } catch (error) {
      return {
        status: 'offline',
        score: 0,
        metrics: {},
        lastCheck: new Date(),
        message: error.message
      };
    }
  }

  private async checkMemoryHealth(): Promise<ComponentHealth> {
    try {
      const metrics = await this.getMemoryMetrics();

      let status: ComponentHealth['status'] = 'healthy';
      let score = 100;

      if (metrics.percentage > this.thresholds.memory.critical) {
        status = 'critical';
        score = 20;
      } else if (metrics.percentage > this.thresholds.memory.warning) {
        status = 'warning';
        score = 60;
      }

      return {
        status,
        score,
        metrics,
        lastCheck: new Date()
      };
    } catch (error) {
      return {
        status: 'offline',
        score: 0,
        metrics: {},
        lastCheck: new Date(),
        message: error.message
      };
    }
  }

  private async checkCPUHealth(): Promise<ComponentHealth> {
    try {
      const metrics = await this.getCPUMetrics();

      let status: ComponentHealth['status'] = 'healthy';
      let score = 100;

      if (metrics.usage > this.thresholds.cpu.critical) {
        status = 'critical';
        score = 20;
      } else if (metrics.usage > this.thresholds.cpu.warning) {
        status = 'warning';
        score = 60;
      }

      return {
        status,
        score,
        metrics,
        lastCheck: new Date()
      };
    } catch (error) {
      return {
        status: 'offline',
        score: 0,
        metrics: {},
        lastCheck: new Date(),
        message: error.message
      };
    }
  }

  private async checkNetworkHealth(): Promise<ComponentHealth> {
    try {
      const metrics = await this.getNetworkMetrics();

      let status: ComponentHealth['status'] = 'healthy';
      let score = 100;

      // Check latency
      if (metrics.latency > 500) {
        status = 'warning';
        score = 60;
      }

      if (metrics.latency > 1000) {
        status = 'critical';
        score = 20;
      }

      return {
        status,
        score,
        metrics,
        lastCheck: new Date()
      };
    } catch (error) {
      return {
        status: 'offline',
        score: 0,
        metrics: {},
        lastCheck: new Date(),
        message: error.message
      };
    }
  }

  private async checkAllModules(): Promise<Record<string, ComponentHealth>> {
    const modules = ['inventory', 'sales', 'crm', 'finance', 'production', 'supply_chain'];
    const moduleHealth: Record<string, ComponentHealth> = {};

    for (const module of modules) {
      moduleHealth[module] = await this.checkModuleHealth(module);
    }

    return moduleHealth;
  }

  private async checkModuleHealth(module: string): Promise<ComponentHealth> {
    try {
      // Check if module has recent activity
      const recentActivity = await this.getModuleActivity(module);
      const errorCount = await this.getModuleErrorCount(module);

      let status: ComponentHealth['status'] = 'healthy';
      let score = 100;

      if (errorCount > 10) {
        status = 'critical';
        score = 20;
      } else if (errorCount > 5) {
        status = 'warning';
        score = 60;
      }

      return {
        status,
        score,
        metrics: {
          recentActivity,
          errorCount,
          lastActivity: new Date()
        },
        lastCheck: new Date(),
        errorRate: errorCount
      };
    } catch (error) {
      return {
        status: 'offline',
        score: 0,
        metrics: {},
        lastCheck: new Date(),
        message: error.message
      };
    }
  }

  private async getCPUMetrics(): Promise<PerformanceMetrics['cpu']> {
    const cpus = os.cpus();
    const loadAvg = os.loadavg();

    // Calculate CPU usage (simplified)
    let totalIdle = 0;
    let totalTick = 0;

    for (const cpu of cpus) {
      for (const type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    }

    const usage = 100 - Math.round(100 * totalIdle / totalTick);

    return {
      usage,
      loadAverage: loadAvg,
      cores: cpus.length
    };
  }

  private async getMemoryMetrics(): Promise<PerformanceMetrics['memory']> {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;

    return {
      used,
      free,
      total,
      percentage: Math.round((used / total) * 100)
    };
  }

  private async getStorageMetrics(): Promise<PerformanceMetrics['storage']> {
    try {
      const stats = await fs.stat(process.cwd());
      // This is simplified - in practice you'd check actual disk usage
      const total = 1000000000; // 1GB placeholder
      const used = 500000000; // 500MB placeholder
      const free = total - used;

      return {
        used,
        free,
        total,
        percentage: Math.round((used / total) * 100)
      };
    } catch (error) {
      return {
        used: 0,
        free: 0,
        total: 0,
        percentage: 0
      };
    }
  }

  private async getDatabaseMetrics(): Promise<PerformanceMetrics['database']> {
    try {
      // These would be actual database metrics in production
      return {
        connections: 10, // Get from connection pool
        activeQueries: 2,
        avgQueryTime: 50,
        slowQueries: 0
      };
    } catch (error) {
      return {
        connections: 0,
        activeQueries: 0,
        avgQueryTime: 0,
        slowQueries: 0
      };
    }
  }

  private async getAPIMetrics(): Promise<PerformanceMetrics['api']> {
    try {
      // These would be actual API metrics in production
      return {
        requestsPerMinute: 100,
        averageResponseTime: 200,
        errorRate: 1,
        activeConnections: 25
      };
    } catch (error) {
      return {
        requestsPerMinute: 0,
        averageResponseTime: 0,
        errorRate: 0,
        activeConnections: 0
      };
    }
  }

  private async getNetworkMetrics(): Promise<PerformanceMetrics['network']> {
    try {
      // Simplified network metrics
      return {
        bytesIn: 1000000,
        bytesOut: 800000,
        connections: 50,
        latency: 10
      };
    } catch (error) {
      return {
        bytesIn: 0,
        bytesOut: 0,
        connections: 0,
        latency: 0
      };
    }
  }

  private async checkThresholds(metrics: PerformanceMetrics): Promise<void> {
    // Check CPU threshold
    if (metrics.cpu.usage > this.thresholds.cpu.critical) {
      await this.createAlert({
        type: 'performance',
        severity: 'critical',
        title: 'Critical CPU Usage',
        message: `CPU usage is ${metrics.cpu.usage}%`,
        component: 'cpu',
        metrics: { usage: metrics.cpu.usage }
      });
    } else if (metrics.cpu.usage > this.thresholds.cpu.warning) {
      await this.createAlert({
        type: 'performance',
        severity: 'high',
        title: 'High CPU Usage',
        message: `CPU usage is ${metrics.cpu.usage}%`,
        component: 'cpu',
        metrics: { usage: metrics.cpu.usage }
      });
    }

    // Check memory threshold
    if (metrics.memory.percentage > this.thresholds.memory.critical) {
      await this.createAlert({
        type: 'performance',
        severity: 'critical',
        title: 'Critical Memory Usage',
        message: `Memory usage is ${metrics.memory.percentage}%`,
        component: 'memory',
        metrics: { percentage: metrics.memory.percentage }
      });
    } else if (metrics.memory.percentage > this.thresholds.memory.warning) {
      await this.createAlert({
        type: 'performance',
        severity: 'high',
        title: 'High Memory Usage',
        message: `Memory usage is ${metrics.memory.percentage}%`,
        component: 'memory',
        metrics: { percentage: metrics.memory.percentage }
      });
    }

    // Similar checks for other metrics...
  }

  private async createAlert(alertData: Omit<SystemAlert, 'id' | 'timestamp' | 'acknowledged' | 'resolved' | 'actions'>): Promise<void> {
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const alert: SystemAlert = {
      ...alertData,
      id: alertId,
      timestamp: new Date(),
      acknowledged: false,
      resolved: false,
      actions: this.getRecommendedActions(alertData.type, alertData.component)
    };

    this.alerts.set(alertId, alert);

    // Send notification for critical alerts
    if (alert.severity === 'critical') {
      await notificationService.sendSystemAlert(
        alert.message,
        'urgent',
        ['admin']
      );
    }

    await AuditService.logActivity({
      userId: 'system',
      action: 'alert_created',
      module: 'system_monitor',
      details: {
        alertId,
        type: alert.type,
        severity: alert.severity,
        component: alert.component
      },
      timestamp: new Date(),
      severity: alert.severity as any
    });
  }

  private getRecommendedActions(type: string, component: string): string[] {
    const actions: Record<string, Record<string, string[]>> = {
      performance: {
        cpu: ['Check running processes', 'Restart resource-intensive services', 'Scale up server resources'],
        memory: ['Check for memory leaks', 'Restart application', 'Increase available memory'],
        storage: ['Clean up old files', 'Archive old data', 'Increase storage capacity'],
        database: ['Optimize queries', 'Check for long-running transactions', 'Scale database resources']
      },
      error: {
        api: ['Check application logs', 'Restart API service', 'Check third-party dependencies'],
        database: ['Check database logs', 'Verify database connectivity', 'Check disk space']
      }
    };

    return actions[type]?.[component] || ['Check system logs', 'Contact system administrator'];
  }

  private getActiveAlerts(): SystemAlert[] {
    return Array.from(this.alerts.values()).filter(alert => !alert.resolved);
  }

  private setupAlertProcessing(): void {
    // Process alerts every 5 minutes
    setInterval(() => {
      this.processAlerts();
    }, 300000);

    // Auto-resolve old alerts after 24 hours
    setInterval(() => {
      this.autoResolveOldAlerts();
    }, 3600000);
  }

  private async processAlerts(): Promise<void> {
    const unacknowledgedAlerts = Array.from(this.alerts.values())
      .filter(alert => !alert.acknowledged && !alert.resolved);

    if (unacknowledgedAlerts.length > 0) {
      // Group alerts by severity
      const criticalAlerts = unacknowledgedAlerts.filter(a => a.severity === 'critical');
      const highAlerts = unacknowledgedAlerts.filter(a => a.severity === 'high');

      if (criticalAlerts.length > 0) {
        // Send escalation notification
        await notificationService.sendSystemAlert(
          `${criticalAlerts.length} critical alerts require immediate attention`,
          'urgent',
          ['admin']
        );
      }
    }
  }

  private autoResolveOldAlerts(): void {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    for (const alert of this.alerts.values()) {
      if (!alert.resolved && alert.timestamp < twentyFourHoursAgo) {
        alert.resolved = true;
        alert.resolvedAt = new Date();
      }
    }
  }

  private cleanupOldMetrics(): void {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp > sevenDaysAgo);
  }

  private async notifyCriticalHealth(health: SystemHealth): Promise<void> {
    const criticalComponents = Object.entries(health.components)
      .filter(([_, component]) => component.status === 'critical')
      .map(([name, _]) => name);

    if (criticalComponents.length > 0) {
      await notificationService.sendSystemAlert(
        `Critical system health detected. Affected components: ${criticalComponents.join(', ')}`,
        'urgent',
        ['admin']
      );
    }
  }

  // Utility methods for getting stats
  private async getActiveUsersCount(): Promise<number> {
    // Get users active in last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return await prisma.auditLog.groupBy({
      by: ['userId'],
      where: { timestamp: { gte: yesterday } }
    }).then(result => result.length);
  }

  private async getTotalTransactionsCount(): Promise<number> {
    try {
      const [sales, purchases] = await Promise.all([
        prisma.sale.count(),
        prisma.purchaseOrder.count()
      ]);
      return sales + purchases;
    } catch (error) {
      return 0;
    }
  }

  private async getErrorCount(): Promise<number> {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return await prisma.auditLog.count({
      where: {
        timestamp: { gte: yesterday },
        outcome: 'failure'
      }
    });
  }

  private async calculateDataSize(): Promise<number> {
    // This would calculate actual database size in production
    return 1000000000; // 1GB placeholder
  }

  private async getModuleStatus(): Promise<SystemStats['moduleStatus']> {
    const modules = ['inventory', 'sales', 'crm', 'finance', 'production'];
    const status: SystemStats['moduleStatus'] = {};

    for (const module of modules) {
      const activity = await this.getModuleActivity(module);
      const errorCount = await this.getModuleErrorCount(module);

      status[module] = {
        status: errorCount > 5 ? 'warning' : 'healthy',
        lastActivity: new Date(),
        errorCount,
        activeUsers: await this.getModuleActiveUsers(module)
      };
    }

    return status;
  }

  private async getModuleActivity(module: string): Promise<number> {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return await prisma.auditLog.count({
      where: {
        module,
        timestamp: { gte: yesterday }
      }
    });
  }

  private async getModuleErrorCount(module: string): Promise<number> {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return await prisma.auditLog.count({
      where: {
        module,
        timestamp: { gte: yesterday },
        outcome: 'failure'
      }
    });
  }

  private async getModuleActiveUsers(module: string): Promise<number> {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await prisma.auditLog.groupBy({
      by: ['userId'],
      where: {
        module,
        timestamp: { gte: yesterday }
      }
    });
    return result.length;
  }
}

// Export singleton instance
export const systemMonitor = SystemMonitor.getInstance();