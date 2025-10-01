import { NextRequest, NextResponse } from 'next/server';
import { AuditService } from '@/lib/services/audit-service';
import { Prisma } from '@prisma/client';

export interface ErrorContext {
  userId?: string;
  module: string;
  action?: string;
  requestId?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp: Date;
  additionalInfo?: Record<string, any>;
}

export interface ErrorReport {
  id: string;
  type: string;
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  resolution?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface ErrorMetrics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsByModule: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  errorRate: number;
  recentErrors: ErrorReport[];
  topErrors: Array<{ type: string; count: number; lastOccurred: Date }>;
}

export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorBuffer: Map<string, ErrorReport[]> = new Map();
  private retryable: Set<string> = new Set([
    'NETWORK_ERROR',
    'TIMEOUT_ERROR',
    'RATE_LIMIT_ERROR',
    'DATABASE_CONNECTION_ERROR'
  ]);

  constructor() {
    this.setupErrorBuffering();
  }

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  // Main error handling method
  async handleError(
    error: Error | unknown,
    context: ErrorContext,
    options?: {
      notify?: boolean;
      retry?: boolean;
      maxRetries?: number;
      skipLogging?: boolean;
    }
  ): Promise<{
    errorId: string;
    shouldRetry: boolean;
    userMessage: string;
    httpStatus: number;
  }> {
    const errorId = this.generateErrorId();
    const errorReport = this.createErrorReport(error, context, errorId);

    try {
      // Log the error unless explicitly skipped
      if (!options?.skipLogging) {
        await this.logError(errorReport);
      }

      // Buffer error for batch processing
      this.bufferError(errorReport);

      // Determine if error should be retried
      const shouldRetry = options?.retry && this.isRetryable(errorReport);

      // Send notifications for critical errors
      if (options?.notify !== false && errorReport.severity === 'critical') {
        await this.notifyError(errorReport);
      }

      // Audit log the error
      await AuditService.logActivity({
        userId: context.userId || 'system',
        action: 'error_occurred',
        module: context.module,
        details: {
          errorId,
          errorType: errorReport.type,
          severity: errorReport.severity,
          message: errorReport.message
        },
        timestamp: context.timestamp,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        outcome: 'failure',
        severity: errorReport.severity
      });

      return {
        errorId,
        shouldRetry,
        userMessage: this.getUserMessage(errorReport),
        httpStatus: this.getHttpStatus(errorReport)
      };
    } catch (handlerError) {
      console.error('Error in error handler:', handlerError);
      return {
        errorId,
        shouldRetry: false,
        userMessage: 'An unexpected error occurred',
        httpStatus: 500
      };
    }
  }

  // API route error handler
  async handleApiError(
    error: Error | unknown,
    request: NextRequest,
    context: Partial<ErrorContext> = {}
  ): Promise<NextResponse> {
    const fullContext: ErrorContext = {
      module: context.module || 'api',
      action: context.action || request.method || 'unknown',
      requestId: request.headers.get('x-request-id') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
      ipAddress: request.ip || undefined,
      timestamp: new Date(),
      additionalInfo: {
        url: request.url,
        method: request.method,
        ...context.additionalInfo
      },
      ...context
    };

    const result = await this.handleError(error, fullContext, {
      notify: true,
      retry: false
    });

    return NextResponse.json(
      {
        error: result.userMessage,
        errorId: result.errorId,
        timestamp: fullContext.timestamp.toISOString()
      },
      { status: result.httpStatus }
    );
  }

  // Client-side error handler
  async handleClientError(
    error: Error | unknown,
    context: Partial<ErrorContext> = {}
  ): Promise<void> {
    const fullContext: ErrorContext = {
      module: context.module || 'client',
      timestamp: new Date(),
      ...context
    };

    await this.handleError(error, fullContext, {
      notify: false,
      retry: false,
      skipLogging: false
    });
  }

  // Database error handler
  async handleDatabaseError(
    error: Prisma.PrismaClientKnownRequestError | Error,
    context: ErrorContext
  ): Promise<{
    errorId: string;
    userMessage: string;
    shouldRetry: boolean;
  }> {
    let errorType = 'DATABASE_ERROR';
    let userMessage = 'A database error occurred';
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          errorType = 'UNIQUE_CONSTRAINT_ERROR';
          userMessage = 'A record with this information already exists';
          severity = 'low';
          break;
        case 'P2025':
          errorType = 'RECORD_NOT_FOUND_ERROR';
          userMessage = 'The requested record was not found';
          severity = 'low';
          break;
        case 'P2003':
          errorType = 'FOREIGN_KEY_ERROR';
          userMessage = 'This operation would violate data integrity';
          severity = 'medium';
          break;
        case 'P2034':
          errorType = 'TRANSACTION_CONFLICT_ERROR';
          userMessage = 'A conflict occurred while processing your request';
          severity = 'medium';
          break;
        default:
          errorType = 'DATABASE_UNKNOWN_ERROR';
          severity = 'high';
      }
    }

    const result = await this.handleError(error, context, {
      notify: severity === 'critical',
      retry: this.retryable.has(errorType)
    });

    return {
      errorId: result.errorId,
      userMessage,
      shouldRetry: result.shouldRetry
    };
  }

  // Validation error handler
  async handleValidationError(
    validationErrors: Array<{ field: string; message: string; code: string }>,
    context: ErrorContext
  ): Promise<{
    errorId: string;
    userMessage: string;
    validationErrors: Array<{ field: string; message: string; code: string }>;
  }> {
    const error = new Error(`Validation failed: ${validationErrors.map(e => e.message).join(', ')}`);

    const result = await this.handleError(error, context, {
      notify: false,
      retry: false
    });

    return {
      errorId: result.errorId,
      userMessage: 'Please check your input and try again',
      validationErrors
    };
  }

  // Business logic error handler
  async handleBusinessError(
    message: string,
    code: string,
    context: ErrorContext,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<{
    errorId: string;
    userMessage: string;
    businessCode: string;
  }> {
    const error = new Error(message);
    error.name = 'BusinessError';

    const result = await this.handleError(error, { ...context }, {
      notify: severity === 'critical',
      retry: false
    });

    return {
      errorId: result.errorId,
      userMessage: message,
      businessCode: code
    };
  }

  // Create error report from error object
  private createErrorReport(
    error: Error | unknown,
    context: ErrorContext,
    errorId: string
  ): ErrorReport {
    let message = 'Unknown error';
    let type = 'UNKNOWN_ERROR';
    let stack: string | undefined;
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium';

    if (error instanceof Error) {
      message = error.message;
      type = error.name || 'Error';
      stack = error.stack;

      // Determine severity based on error type
      if (type.includes('Security') || type.includes('Auth')) {
        severity = 'critical';
      } else if (type.includes('Database') || type.includes('Network')) {
        severity = 'high';
      } else if (type.includes('Validation') || type.includes('Business')) {
        severity = 'low';
      }
    } else if (typeof error === 'string') {
      message = error;
      type = 'STRING_ERROR';
    } else {
      message = JSON.stringify(error);
      type = 'OBJECT_ERROR';
    }

    return {
      id: errorId,
      type,
      message,
      stack,
      context,
      severity,
      resolved: false
    };
  }

  // Log error to database
  private async logError(errorReport: ErrorReport): Promise<void> {
    try {
      await prisma.errorLog.create({
        data: {
          id: errorReport.id,
          type: errorReport.type,
          message: errorReport.message,
          stack: errorReport.stack,
          context: JSON.stringify(errorReport.context),
          severity: errorReport.severity,
          resolved: false,
          timestamp: errorReport.context.timestamp
        }
      });
    } catch (logError) {
      console.error('Failed to log error to database:', logError);
    }
  }

  // Buffer errors for batch processing
  private bufferError(errorReport: ErrorReport): void {
    const module = errorReport.context.module;
    if (!this.errorBuffer.has(module)) {
      this.errorBuffer.set(module, []);
    }
    this.errorBuffer.get(module)!.push(errorReport);
  }

  // Setup error buffering and batch processing
  private setupErrorBuffering(): void {
    // Process buffered errors every 30 seconds
    setInterval(async () => {
      await this.processBatchedErrors();
    }, 30000);

    // Clear old buffered errors every 5 minutes
    setInterval(() => {
      this.clearOldBufferedErrors();
    }, 300000);
  }

  private async processBatchedErrors(): Promise<void> {
    for (const [module, errors] of this.errorBuffer.entries()) {
      if (errors.length === 0) continue;

      try {
        // Analyze error patterns
        await this.analyzeErrorPatterns(module, errors);

        // Process critical errors
        const criticalErrors = errors.filter(e => e.severity === 'critical');
        if (criticalErrors.length > 0) {
          await this.processCriticalErrors(criticalErrors);
        }

        // Clear processed errors
        this.errorBuffer.set(module, []);
      } catch (error) {
        console.error(`Failed to process batched errors for ${module}:`, error);
      }
    }
  }

  private clearOldBufferedErrors(): void {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    for (const [module, errors] of this.errorBuffer.entries()) {
      const recentErrors = errors.filter(
        error => error.context.timestamp > fiveMinutesAgo
      );
      this.errorBuffer.set(module, recentErrors);
    }
  }

  private async analyzeErrorPatterns(module: string, errors: ErrorReport[]): Promise<void> {
    // Group errors by type
    const errorsByType = errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Check for error spikes
    for (const [errorType, count] of Object.entries(errorsByType)) {
      if (count > 10) { // More than 10 errors of same type in 30 seconds
        await this.handleErrorSpike(module, errorType, count);
      }
    }
  }

  private async processCriticalErrors(errors: ErrorReport[]): Promise<void> {
    for (const error of errors) {
      await this.escalateCriticalError(error);
    }
  }

  private async handleErrorSpike(module: string, errorType: string, count: number): Promise<void> {
    console.warn(`Error spike detected in ${module}: ${errorType} occurred ${count} times`);

    // Log error spike
    await AuditService.logActivity({
      userId: 'system',
      action: 'error_spike_detected',
      module: 'error_handler',
      details: { module, errorType, count },
      timestamp: new Date(),
      severity: 'high'
    });
  }

  private async escalateCriticalError(error: ErrorReport): Promise<void> {
    console.error('CRITICAL ERROR ESCALATION:', error);

    // This would integrate with your alerting system
    // For example: send to Slack, email, PagerDuty, etc.
  }

  private async notifyError(errorReport: ErrorReport): Promise<void> {
    try {
      // This would integrate with your notification system
      console.log('Notifying error:', errorReport.id);
    } catch (error) {
      console.error('Failed to notify error:', error);
    }
  }

  private isRetryable(errorReport: ErrorReport): boolean {
    return this.retryable.has(errorReport.type);
  }

  private getUserMessage(errorReport: ErrorReport): string {
    switch (errorReport.type) {
      case 'VALIDATION_ERROR':
        return 'Please check your input and try again';
      case 'PERMISSION_ERROR':
        return 'You do not have permission to perform this action';
      case 'RATE_LIMIT_ERROR':
        return 'Too many requests. Please try again later';
      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection and try again';
      case 'DATABASE_ERROR':
        return 'A database error occurred. Please try again';
      default:
        return 'An unexpected error occurred. Please try again';
    }
  }

  private getHttpStatus(errorReport: ErrorReport): number {
    switch (errorReport.type) {
      case 'VALIDATION_ERROR':
        return 400;
      case 'PERMISSION_ERROR':
        return 403;
      case 'NOT_FOUND_ERROR':
        return 404;
      case 'RATE_LIMIT_ERROR':
        return 429;
      case 'DATABASE_ERROR':
      case 'NETWORK_ERROR':
        return 500;
      default:
        return 500;
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods for error management
  public async getErrorMetrics(
    startDate?: Date,
    endDate?: Date,
    module?: string
  ): Promise<ErrorMetrics> {
    try {
      const where: any = {};
      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp.gte = startDate;
        if (endDate) where.timestamp.lte = endDate;
      }
      if (module) {
        where.context = { contains: `"module":"${module}"` };
      }

      const [
        totalErrors,
        errorsByType,
        errorsBySeverity,
        recentErrors
      ] = await Promise.all([
        prisma.errorLog.count({ where }),
        prisma.errorLog.groupBy({
          by: ['type'],
          where,
          _count: { type: true }
        }),
        prisma.errorLog.groupBy({
          by: ['severity'],
          where,
          _count: { severity: true }
        }),
        prisma.errorLog.findMany({
          where,
          orderBy: { timestamp: 'desc' },
          take: 10
        })
      ]);

      const typeStats = errorsByType.reduce((acc, item) => {
        acc[item.type] = item._count.type;
        return acc;
      }, {} as Record<string, number>);

      const severityStats = errorsBySeverity.reduce((acc, item) => {
        acc[item.severity] = item._count.severity;
        return acc;
      }, {} as Record<string, number>);

      // Calculate error rate (errors per hour)
      const hoursDiff = startDate && endDate
        ? (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
        : 24; // Default to last 24 hours
      const errorRate = totalErrors / hoursDiff;

      const formattedRecentErrors = recentErrors.map(error => ({
        id: error.id,
        type: error.type,
        message: error.message,
        stack: error.stack,
        context: JSON.parse(error.context),
        severity: error.severity as 'low' | 'medium' | 'high' | 'critical',
        resolved: error.resolved,
        resolution: error.resolution,
        resolvedAt: error.resolvedAt,
        resolvedBy: error.resolvedBy
      }));

      return {
        totalErrors,
        errorsByType: typeStats,
        errorsByModule: {}, // Would need to parse context JSON
        errorsBySeverity: severityStats,
        errorRate,
        recentErrors: formattedRecentErrors,
        topErrors: [] // Would need aggregation query
      };
    } catch (error) {
      console.error('Failed to get error metrics:', error);
      return {
        totalErrors: 0,
        errorsByType: {},
        errorsByModule: {},
        errorsBySeverity: {},
        errorRate: 0,
        recentErrors: [],
        topErrors: []
      };
    }
  }

  public async resolveError(
    errorId: string,
    resolution: string,
    resolvedBy: string
  ): Promise<boolean> {
    try {
      await prisma.errorLog.update({
        where: { id: errorId },
        data: {
          resolved: true,
          resolution,
          resolvedAt: new Date(),
          resolvedBy
        }
      });

      await AuditService.logActivity({
        userId: resolvedBy,
        action: 'error_resolved',
        module: 'error_handler',
        details: { errorId, resolution },
        timestamp: new Date()
      });

      return true;
    } catch (error) {
      console.error('Failed to resolve error:', error);
      return false;
    }
  }

  public async getErrorDetails(errorId: string): Promise<ErrorReport | null> {
    try {
      const errorLog = await prisma.errorLog.findUnique({
        where: { id: errorId }
      });

      if (!errorLog) return null;

      return {
        id: errorLog.id,
        type: errorLog.type,
        message: errorLog.message,
        stack: errorLog.stack,
        context: JSON.parse(errorLog.context),
        severity: errorLog.severity as 'low' | 'medium' | 'high' | 'critical',
        resolved: errorLog.resolved,
        resolution: errorLog.resolution,
        resolvedAt: errorLog.resolvedAt,
        resolvedBy: errorLog.resolvedBy
      };
    } catch (error) {
      console.error('Failed to get error details:', error);
      return null;
    }
  }
}

// Export singleton instance
export const errorHandler = GlobalErrorHandler.getInstance();