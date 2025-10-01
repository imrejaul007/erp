import { prisma } from '@/lib/prisma';

export interface AuditLog {
  id?: string;
  userId: string;
  action: string;
  module: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  outcome?: 'success' | 'failure' | 'pending';
  errorMessage?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
}

export interface AuditQuery {
  userId?: string;
  module?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  severity?: string;
  outcome?: string;
  limit?: number;
  offset?: number;
  searchTerm?: string;
  tags?: string[];
}

export interface AuditStats {
  totalLogs: number;
  logsByModule: Record<string, number>;
  logsByAction: Record<string, number>;
  logsBySeverity: Record<string, number>;
  recentActivity: AuditLog[];
  topUsers: Array<{ userId: string; count: number }>;
  errorRate: number;
  securityEvents: number;
}

export class AuditService {
  // Core logging method
  static async logActivity(auditData: AuditLog): Promise<string> {
    try {
      const auditLog = await prisma.auditLog.create({
        data: {
          userId: auditData.userId,
          action: auditData.action,
          module: auditData.module,
          details: JSON.stringify(auditData.details),
          timestamp: auditData.timestamp,
          ipAddress: auditData.ipAddress,
          userAgent: auditData.userAgent,
          sessionId: auditData.sessionId,
          outcome: auditData.outcome || 'success',
          errorMessage: auditData.errorMessage,
          severity: auditData.severity || 'low',
          tags: auditData.tags ? JSON.stringify(auditData.tags) : null
        }
      });

      // Check for security events
      await this.checkSecurityEvents(auditData);

      // Trigger alerts for critical events
      if (auditData.severity === 'critical') {
        await this.triggerCriticalAlert(auditData);
      }

      return auditLog.id;
    } catch (error) {
      console.error('Audit logging error:', error);
      // Don't let audit failures break the main operation
      return 'audit_failed';
    }
  }

  // Batch logging for performance
  static async logActivities(auditDataArray: AuditLog[]): Promise<string[]> {
    try {
      const auditLogs = await prisma.auditLog.createMany({
        data: auditDataArray.map(auditData => ({
          userId: auditData.userId,
          action: auditData.action,
          module: auditData.module,
          details: JSON.stringify(auditData.details),
          timestamp: auditData.timestamp,
          ipAddress: auditData.ipAddress,
          userAgent: auditData.userAgent,
          sessionId: auditData.sessionId,
          outcome: auditData.outcome || 'success',
          errorMessage: auditData.errorMessage,
          severity: auditData.severity || 'low',
          tags: auditData.tags ? JSON.stringify(auditData.tags) : null
        }))
      });

      // Check each for security events
      for (const auditData of auditDataArray) {
        await this.checkSecurityEvents(auditData);
      }

      return auditDataArray.map((_, index) => `batch_${index}`);
    } catch (error) {
      console.error('Batch audit logging error:', error);
      return auditDataArray.map(() => 'audit_failed');
    }
  }

  // Query audit logs
  static async queryLogs(query: AuditQuery): Promise<{
    logs: AuditLog[];
    total: number;
    hasMore: boolean;
  }> {
    try {
      const where: any = {};

      if (query.userId) where.userId = query.userId;
      if (query.module) where.module = query.module;
      if (query.action) where.action = query.action;
      if (query.severity) where.severity = query.severity;
      if (query.outcome) where.outcome = query.outcome;

      if (query.startDate || query.endDate) {
        where.timestamp = {};
        if (query.startDate) where.timestamp.gte = query.startDate;
        if (query.endDate) where.timestamp.lte = query.endDate;
      }

      if (query.searchTerm) {
        where.OR = [
          { action: { contains: query.searchTerm, mode: 'insensitive' } },
          { module: { contains: query.searchTerm, mode: 'insensitive' } },
          { details: { contains: query.searchTerm, mode: 'insensitive' } }
        ];
      }

      if (query.tags && query.tags.length > 0) {
        where.tags = {
          contains: JSON.stringify(query.tags)
        };
      }

      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          orderBy: { timestamp: 'desc' },
          take: query.limit || 50,
          skip: query.offset || 0
        }),
        prisma.auditLog.count({ where })
      ]);

      const formattedLogs = logs.map(log => ({
        id: log.id,
        userId: log.userId,
        action: log.action,
        module: log.module,
        details: JSON.parse(log.details),
        timestamp: log.timestamp,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        sessionId: log.sessionId,
        outcome: log.outcome as 'success' | 'failure' | 'pending',
        errorMessage: log.errorMessage,
        severity: log.severity as 'low' | 'medium' | 'high' | 'critical',
        tags: log.tags ? JSON.parse(log.tags) : []
      }));

      return {
        logs: formattedLogs,
        total,
        hasMore: (query.offset || 0) + (query.limit || 50) < total
      };
    } catch (error) {
      console.error('Query audit logs error:', error);
      return { logs: [], total: 0, hasMore: false };
    }
  }

  // Get audit statistics
  static async getStats(startDate?: Date, endDate?: Date): Promise<AuditStats> {
    try {
      const where: any = {};
      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp.gte = startDate;
        if (endDate) where.timestamp.lte = endDate;
      }

      const [
        totalLogs,
        logsByModule,
        logsByAction,
        logsBySeverity,
        recentActivity,
        topUsers,
        errorCount,
        securityEventCount
      ] = await Promise.all([
        prisma.auditLog.count({ where }),
        prisma.auditLog.groupBy({
          by: ['module'],
          where,
          _count: { module: true }
        }),
        prisma.auditLog.groupBy({
          by: ['action'],
          where,
          _count: { action: true }
        }),
        prisma.auditLog.groupBy({
          by: ['severity'],
          where,
          _count: { severity: true }
        }),
        prisma.auditLog.findMany({
          where,
          orderBy: { timestamp: 'desc' },
          take: 10
        }),
        prisma.auditLog.groupBy({
          by: ['userId'],
          where,
          _count: { userId: true },
          orderBy: { _count: { userId: 'desc' } },
          take: 5
        }),
        prisma.auditLog.count({
          where: { ...where, outcome: 'failure' }
        }),
        prisma.auditLog.count({
          where: {
            ...where,
            OR: [
              { action: { contains: 'login_failed' } },
              { action: { contains: 'unauthorized' } },
              { action: { contains: 'security' } },
              { severity: 'critical' }
            ]
          }
        })
      ]);

      const moduleStats = logsByModule.reduce((acc, item) => {
        acc[item.module] = item._count.module;
        return acc;
      }, {} as Record<string, number>);

      const actionStats = logsByAction.reduce((acc, item) => {
        acc[item.action] = item._count.action;
        return acc;
      }, {} as Record<string, number>);

      const severityStats = logsBySeverity.reduce((acc, item) => {
        acc[item.severity] = item._count.severity;
        return acc;
      }, {} as Record<string, number>);

      const formattedRecentActivity = recentActivity.map(log => ({
        id: log.id,
        userId: log.userId,
        action: log.action,
        module: log.module,
        details: JSON.parse(log.details),
        timestamp: log.timestamp,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        sessionId: log.sessionId,
        outcome: log.outcome as 'success' | 'failure' | 'pending',
        errorMessage: log.errorMessage,
        severity: log.severity as 'low' | 'medium' | 'high' | 'critical',
        tags: log.tags ? JSON.parse(log.tags) : []
      }));

      const topUsersFormatted = topUsers.map(user => ({
        userId: user.userId,
        count: user._count.userId
      }));

      return {
        totalLogs,
        logsByModule: moduleStats,
        logsByAction: actionStats,
        logsBySeverity: severityStats,
        recentActivity: formattedRecentActivity,
        topUsers: topUsersFormatted,
        errorRate: totalLogs > 0 ? (errorCount / totalLogs) * 100 : 0,
        securityEvents: securityEventCount
      };
    } catch (error) {
      console.error('Get audit stats error:', error);
      return {
        totalLogs: 0,
        logsByModule: {},
        logsByAction: {},
        logsBySeverity: {},
        recentActivity: [],
        topUsers: [],
        errorRate: 0,
        securityEvents: 0
      };
    }
  }

  // Security event detection
  private static async checkSecurityEvents(auditData: AuditLog): Promise<void> {
    try {
      const securityActions = [
        'login_failed',
        'unauthorized_access',
        'password_changed',
        'permission_denied',
        'suspicious_activity',
        'data_export',
        'admin_action'
      ];

      if (securityActions.some(action => auditData.action.includes(action))) {
        await this.logSecurityEvent(auditData);
      }

      // Check for suspicious patterns
      await this.checkSuspiciousPatterns(auditData);
    } catch (error) {
      console.error('Security event check error:', error);
    }
  }

  private static async logSecurityEvent(auditData: AuditLog): Promise<void> {
    try {
      await prisma.securityEvent.create({
        data: {
          userId: auditData.userId,
          action: auditData.action,
          module: auditData.module,
          details: JSON.stringify(auditData.details),
          timestamp: auditData.timestamp,
          ipAddress: auditData.ipAddress,
          severity: auditData.severity || 'medium',
          resolved: false
        }
      });
    } catch (error) {
      console.error('Log security event error:', error);
    }
  }

  private static async checkSuspiciousPatterns(auditData: AuditLog): Promise<void> {
    try {
      // Check for rapid failed login attempts
      if (auditData.action.includes('login_failed')) {
        const recentFailures = await prisma.auditLog.count({
          where: {
            userId: auditData.userId,
            action: { contains: 'login_failed' },
            timestamp: {
              gte: new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
            }
          }
        });

        if (recentFailures >= 5) {
          await this.triggerSecurityAlert({
            type: 'brute_force_attempt',
            userId: auditData.userId,
            details: { failureCount: recentFailures }
          });
        }
      }

      // Check for unusual access patterns
      if (auditData.ipAddress) {
        const recentIPs = await prisma.auditLog.findMany({
          where: {
            userId: auditData.userId,
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          },
          select: { ipAddress: true },
          distinct: ['ipAddress']
        });

        if (recentIPs.length >= 5) {
          await this.triggerSecurityAlert({
            type: 'multiple_ip_access',
            userId: auditData.userId,
            details: { ipCount: recentIPs.length, ips: recentIPs }
          });
        }
      }
    } catch (error) {
      console.error('Check suspicious patterns error:', error);
    }
  }

  private static async triggerCriticalAlert(auditData: AuditLog): Promise<void> {
    try {
      // This would integrate with your notification system
      console.log('CRITICAL AUDIT EVENT:', auditData);

      // Example: Send notification to administrators
      // await NotificationService.sendAlert({
      //   type: 'critical_audit_event',
      //   recipients: ['admin@company.com'],
      //   subject: 'Critical System Event',
      //   data: auditData
      // });
    } catch (error) {
      console.error('Trigger critical alert error:', error);
    }
  }

  private static async triggerSecurityAlert(alertData: {
    type: string;
    userId: string;
    details: any;
  }): Promise<void> {
    try {
      console.log('SECURITY ALERT:', alertData);

      // Example: Log security alert and notify security team
      await this.logActivity({
        userId: alertData.userId,
        action: 'security_alert_triggered',
        module: 'security',
        details: alertData,
        timestamp: new Date(),
        severity: 'high',
        tags: ['security', 'alert', alertData.type]
      });
    } catch (error) {
      console.error('Trigger security alert error:', error);
    }
  }

  // Data retention management
  static async cleanupOldLogs(retentionDays: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

      const deleted = await prisma.auditLog.deleteMany({
        where: {
          timestamp: { lt: cutoffDate },
          severity: { not: 'critical' } // Keep critical logs longer
        }
      });

      await this.logActivity({
        userId: 'system',
        action: 'audit_cleanup',
        module: 'audit',
        details: { deletedCount: deleted.count, retentionDays },
        timestamp: new Date(),
        severity: 'low'
      });

      return deleted.count;
    } catch (error) {
      console.error('Cleanup old logs error:', error);
      return 0;
    }
  }

  // Export audit data
  static async exportLogs(query: AuditQuery, format: 'json' | 'csv' = 'json'): Promise<string> {
    try {
      const { logs } = await this.queryLogs({ ...query, limit: 10000 });

      if (format === 'csv') {
        const headers = ['Timestamp', 'User ID', 'Action', 'Module', 'Outcome', 'Severity', 'IP Address'];
        const csvRows = [
          headers.join(','),
          ...logs.map(log => [
            log.timestamp.toISOString(),
            log.userId,
            log.action,
            log.module,
            log.outcome,
            log.severity,
            log.ipAddress || ''
          ].join(','))
        ];
        return csvRows.join('\n');
      }

      return JSON.stringify(logs, null, 2);
    } catch (error) {
      console.error('Export logs error:', error);
      return '';
    }
  }

  // Real-time audit streaming
  static async streamLogs(callback: (log: AuditLog) => void): Promise<void> {
    // This would implement real-time streaming of audit logs
    // For example, using database triggers or message queues
    console.log('Audit log streaming started');
  }
}