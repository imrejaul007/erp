/**
 * Centralized logging system for production-grade error tracking
 * Supports different log levels and can integrate with external services
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  tenantId?: string;
  requestId?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  /**
   * Log informational messages
   */
  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log warning messages
   */
  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log error messages
   */
  error(message: string, error?: Error | unknown, context?: Record<string, any>) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log(LogLevel.ERROR, message, { ...context, error: errorObj });
  }

  /**
   * Log fatal errors that require immediate attention
   */
  fatal(message: string, error?: Error | unknown, context?: Record<string, any>) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log(LogLevel.FATAL, message, { ...context, error: errorObj });
  }

  /**
   * Core logging function
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
    };

    // Console output with color coding
    const consoleMethod = this.getConsoleMethod(level);
    const prefix = this.getPrefix(level);

    if (context?.error) {
      consoleMethod(`${prefix} ${message}`, context.error);
    } else {
      consoleMethod(`${prefix} ${message}`, context || '');
    }

    // In production, you can send logs to external services here
    // Examples: Sentry, LogRocket, CloudWatch, DataDog, etc.
    if (!this.isDevelopment && (level === LogLevel.ERROR || level === LogLevel.FATAL)) {
      this.sendToExternalService(entry);
    }

    // Store critical errors in database for audit trail
    if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
      this.storeInDatabase(entry).catch(() => {
        // Fail silently to avoid infinite loops
      });
    }
  }

  /**
   * Get console method based on log level
   */
  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return console.error;
      default:
        return console.log;
    }
  }

  /**
   * Get colored prefix for console output
   */
  private getPrefix(level: LogLevel): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}]`;
  }

  /**
   * Send logs to external monitoring service
   * Configure with your preferred service (Sentry, LogRocket, etc.)
   */
  private sendToExternalService(entry: LogEntry) {
    // Example: Sentry integration
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(entry.context?.error, {
    //     level: entry.level as any,
    //     extra: entry.context,
    //   });
    // }

    // For now, just prepare the data
    // You can add actual integration later
  }

  /**
   * Store critical errors in database
   */
  private async storeInDatabase(entry: LogEntry) {
    try {
      // In a real implementation, store in your database
      // This prevents errors from being lost
      // await prisma.errorLog.create({
      //   data: {
      //     level: entry.level,
      //     message: entry.message,
      //     stack: entry.context?.error?.stack,
      //     context: entry.context ? JSON.stringify(entry.context) : null,
      //     userId: entry.userId,
      //     tenantId: entry.tenantId,
      //   },
      // });
    } catch {
      // Fail silently
    }
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Utility function to create request-scoped logger
 */
export function createRequestLogger(requestId: string, userId?: string, tenantId?: string) {
  return {
    debug: (message: string, context?: Record<string, any>) =>
      logger.debug(message, { ...context, requestId, userId, tenantId }),
    info: (message: string, context?: Record<string, any>) =>
      logger.info(message, { ...context, requestId, userId, tenantId }),
    warn: (message: string, context?: Record<string, any>) =>
      logger.warn(message, { ...context, requestId, userId, tenantId }),
    error: (message: string, error?: Error | unknown, context?: Record<string, any>) =>
      logger.error(message, error, { ...context, requestId, userId, tenantId }),
    fatal: (message: string, error?: Error | unknown, context?: Record<string, any>) =>
      logger.fatal(message, error, { ...context, requestId, userId, tenantId }),
  };
}
