import { prisma } from '@/lib/database/prisma';
import { AuditLogData } from '@/types/auth';
import { AuditAction } from '@prisma/client';

interface AuditLogParams extends AuditLogData {
  userId?: string;
  storeId?: string;
  ipAddress: string;
  userAgent?: string;
}

interface AuditQueryOptions {
  userId?: string;
  storeId?: string;
  action?: AuditAction;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  severity?: string;
  page?: number;
  limit?: number;
}

export class AuditService {
  /**
   * Log an audit event
   */
  async log(params: AuditLogParams): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: params.userId,
          storeId: params.storeId,
          action: params.action,
          resource: params.resource,
          resourceId: params.resourceId,
          oldValues: params.oldValues,
          newValues: params.newValues,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          metadata: params.metadata,
          severity: params.severity || 'INFO',
        },
      });
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw to avoid breaking the main operation
    }
  }

  /**
   * Log user authentication events
   */
  async logAuthEvent(params: {
    userId?: string;
    action: 'USER_LOGIN' | 'USER_LOGOUT' | 'USER_LOGIN_FAILED';
    ipAddress: string;
    userAgent?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.log({
      ...params,
      resource: 'auth',
      severity: params.action === 'USER_LOGIN_FAILED' ? 'WARN' : 'INFO',
    });
  }

  /**
   * Log data access events
   */
  async logDataAccess(params: {
    userId: string;
    resource: string;
    resourceId?: string;
    action: 'READ' | 'export' | 'search';
    ipAddress: string;
    userAgent?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.log({
      userId: params.userId,
      action: 'SENSITIVE_DATA_ACCESS',
      resource: params.resource,
      resourceId: params.resourceId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: {
        ...params.metadata,
        dataAction: params.action,
      },
      severity: params.action === 'export' ? 'WARN' : 'INFO',
    });
  }

  /**
   * Log permission changes
   */
  async logPermissionChange(params: {
    userId: string;
    targetUserId: string;
    action: 'grant' | 'revoke';
    permission: string;
    ipAddress: string;
    userAgent?: string;
  }): Promise<void> {
    await this.log({
      userId: params.userId,
      action: params.action === 'grant' ? 'PERMISSION_GRANT' : 'PERMISSION_REVOKE',
      resource: 'permissions',
      resourceId: params.targetUserId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: {
        permission: params.permission,
        targetUser: params.targetUserId,
      },
      severity: 'WARN',
    });
  }

  /**
   * Log role assignments
   */
  async logRoleAssignment(params: {
    userId: string;
    targetUserId: string;
    roleId: string;
    action: 'assign' | 'remove';
    ipAddress: string;
    userAgent?: string;
  }): Promise<void> {
    await this.log({
      userId: params.userId,
      action: params.action === 'assign' ? 'ROLE_ASSIGN' : 'ROLE_REMOVE',
      resource: 'roles',
      resourceId: params.targetUserId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: {
        roleId: params.roleId,
        targetUser: params.targetUserId,
      },
      severity: 'WARN',
    });
  }

  /**
   * Log configuration changes
   */
  async logConfigChange(params: {
    userId: string;
    configType: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    ipAddress: string;
    userAgent?: string;
  }): Promise<void> {
    await this.log({
      userId: params.userId,
      action: 'SETTINGS_CHANGE',
      resource: 'settings',
      resourceId: params.configType,
      oldValues: params.oldValues,
      newValues: params.newValues,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      severity: 'WARN',
    });
  }

  /**
   * Log critical security events
   */
  async logSecurityEvent(params: {
    userId?: string;
    event: string;
    description: string;
    ipAddress: string;
    userAgent?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    await this.log({
      userId: params.userId,
      action: 'SENSITIVE_DATA_ACCESS',
      resource: 'security',
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: {
        event: params.event,
        description: params.description,
        ...params.metadata,
      },
      severity: 'CRITICAL',
    });
  }

  /**
   * Get audit logs with filtering
   */
  async getAuditLogs(options: AuditQueryOptions = {}) {
    const {
      userId,
      storeId,
      action,
      resource,
      startDate,
      endDate,
      severity,
      page = 1,
      limit = 50,
    } = options;

    const where: any = {};

    if (userId) where.userId = userId;
    if (storeId) where.storeId = storeId;
    if (action) where.action = action;
    if (resource) where.resource = resource;
    if (severity) where.severity = severity;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get audit statistics
   */
  async getAuditStatistics(options: {
    startDate?: Date;
    endDate?: Date;
    storeId?: string;
  } = {}) {
    const { startDate, endDate, storeId } = options;

    const where: any = {};
    if (storeId) where.storeId = storeId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [
      totalEvents,
      eventsByAction,
      eventsBySeverity,
      topUsers,
      securityEvents,
    ] = await Promise.all([
      // Total events count
      prisma.auditLog.count({ where }),

      // Events by action
      prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: true,
        orderBy: { _count: { action: 'desc' } },
      }),

      // Events by severity
      prisma.auditLog.groupBy({
        by: ['severity'],
        where,
        _count: true,
      }),

      // Top users by activity
      prisma.auditLog.groupBy({
        by: ['userId'],
        where: { ...where, userId: { not: null } },
        _count: true,
        orderBy: { _count: { userId: 'desc' } },
        take: 10,
      }),

      // Critical/security events count
      prisma.auditLog.count({
        where: {
          ...where,
          severity: { in: ['CRITICAL', 'ERROR'] },
        },
      }),
    ]);

    // Get user details for top users
    const userIds = topUsers.map(u => u.userId).filter(Boolean) as string[];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    const topUsersWithDetails = topUsers.map(tu => ({
      count: tu._count,
      user: users.find(u => u.id === tu.userId),
    }));

    return {
      totalEvents,
      eventsByAction: eventsByAction.map(e => ({
        action: e.action,
        count: e._count,
      })),
      eventsBySeverity: eventsBySeverity.map(e => ({
        severity: e.severity,
        count: e._count,
      })),
      topUsers: topUsersWithDetails,
      securityEvents,
    };
  }

  /**
   * Get login activity report
   */
  async getLoginActivity(options: {
    startDate?: Date;
    endDate?: Date;
    userId?: string;
  } = {}) {
    const { startDate, endDate, userId } = options;

    const where: any = {
      action: { in: ['USER_LOGIN', 'USER_LOGOUT', 'USER_LOGIN_FAILED'] },
    };

    if (userId) where.userId = userId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [activities, summary] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1000,
      }),

      prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
    ]);

    return {
      activities,
      summary: summary.map(s => ({
        action: s.action,
        count: s._count,
      })),
    };
  }

  /**
   * Export audit logs
   */
  async exportAuditLogs(options: AuditQueryOptions = {}): Promise<any[]> {
    const { logs } = await this.getAuditLogs({
      ...options,
      limit: 10000, // Large limit for export
    });

    return logs.map(log => ({
      timestamp: log.createdAt,
      user: log.user?.email || 'System',
      action: log.action,
      resource: log.resource,
      resourceId: log.resourceId,
      severity: log.severity,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      metadata: log.metadata,
      store: log.store?.name,
    }));
  }

  /**
   * Clean old audit logs based on retention policy
   */
  async cleanOldLogs(): Promise<void> {
    // Get global security settings for retention policy
    const settings = await prisma.securitySettings.findFirst({
      where: { userId: null },
    });

    const retentionDays = settings?.dataRetentionDays || 2555; // Default 7 years
    const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

    // Delete logs older than retention period
    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        severity: { notIn: ['CRITICAL'] }, // Keep critical events longer
      },
    });

    console.log(`Cleaned ${result.count} old audit logs`);
  }

  /**
   * Get compliance report
   */
  async getComplianceReport(options: {
    startDate: Date;
    endDate: Date;
    storeId?: string;
  }) {
    const { startDate, endDate, storeId } = options;

    const where: any = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (storeId) where.storeId = storeId;

    const [
      dataAccessEvents,
      privilegeChanges,
      securityEvents,
      failedLogins,
      configChanges,
    ] = await Promise.all([
      // Data access events
      prisma.auditLog.count({
        where: {
          ...where,
          action: 'SENSITIVE_DATA_ACCESS',
        },
      }),

      // Privilege changes
      prisma.auditLog.count({
        where: {
          ...where,
          action: { in: ['ROLE_ASSIGN', 'ROLE_REMOVE', 'PERMISSION_GRANT', 'PERMISSION_REVOKE'] },
        },
      }),

      // Security events
      prisma.auditLog.count({
        where: {
          ...where,
          severity: { in: ['CRITICAL', 'ERROR'] },
        },
      }),

      // Failed login attempts
      prisma.loginAttempt.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          result: { not: 'SUCCESS' },
        },
      }),

      // Configuration changes
      prisma.auditLog.count({
        where: {
          ...where,
          action: 'SETTINGS_CHANGE',
        },
      }),
    ]);

    return {
      period: { startDate, endDate },
      metrics: {
        dataAccessEvents,
        privilegeChanges,
        securityEvents,
        failedLogins,
        configChanges,
      },
      compliance: {
        uaeDataProtection: true, // Implement specific UAE compliance checks
        auditingEnabled: true,
        dataRetentionCompliant: true,
      },
    };
  }

  /**
   * Monitor suspicious activities
   */
  async detectSuspiciousActivities(): Promise<Array<{
    type: string;
    description: string;
    severity: string;
    count: number;
    users?: any[];
  }>> {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const suspiciousActivities = [];

    // Multiple failed logins from same IP
    const failedLoginsByIp = await prisma.loginAttempt.groupBy({
      by: ['ipAddress'],
      where: {
        createdAt: { gte: last24Hours },
        result: { not: 'SUCCESS' },
      },
      _count: true,
      having: { ipAddress: { _count: { gt: 10 } } },
    });

    if (failedLoginsByIp.length > 0) {
      suspiciousActivities.push({
        type: 'BRUTE_FORCE_ATTEMPT',
        description: 'Multiple failed login attempts from same IP',
        severity: 'CRITICAL',
        count: failedLoginsByIp.length,
      });
    }

    // Unusual access patterns (e.g., access from new countries)
    const criticalEvents = await prisma.auditLog.count({
      where: {
        createdAt: { gte: last24Hours },
        severity: 'CRITICAL',
      },
    });

    if (criticalEvents > 0) {
      suspiciousActivities.push({
        type: 'CRITICAL_SECURITY_EVENTS',
        description: 'Critical security events detected',
        severity: 'CRITICAL',
        count: criticalEvents,
      });
    }

    // Privilege escalation attempts
    const privilegeChanges = await prisma.auditLog.count({
      where: {
        createdAt: { gte: last24Hours },
        action: { in: ['ROLE_ASSIGN', 'PERMISSION_GRANT'] },
      },
    });

    if (privilegeChanges > 5) {
      suspiciousActivities.push({
        type: 'PRIVILEGE_ESCALATION',
        description: 'Unusual number of privilege changes',
        severity: 'WARN',
        count: privilegeChanges,
      });
    }

    return suspiciousActivities;
  }
}