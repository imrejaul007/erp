import { NextRequest } from 'next/server';

/**
 * Request log entry structure
 */
export interface RequestLog {
  timestamp: string;
  method: string;
  path: string;
  query: Record<string, string>;
  tenantId?: string;
  userId?: string;
  userAgent?: string;
  ip?: string;
  duration?: number;
  statusCode?: number;
  error?: string;
}

/**
 * Log colors for console output
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Status colors
  success: '\x1b[32m', // green
  warning: '\x1b[33m', // yellow
  error: '\x1b[31m',   // red
  info: '\x1b[36m',    // cyan

  // Method colors
  GET: '\x1b[34m',     // blue
  POST: '\x1b[32m',    // green
  PUT: '\x1b[33m',     // yellow
  DELETE: '\x1b[31m',  // red
  PATCH: '\x1b[35m',   // magenta
};

/**
 * Get status color based on status code
 */
function getStatusColor(statusCode: number): string {
  if (statusCode >= 500) return colors.error;
  if (statusCode >= 400) return colors.warning;
  if (statusCode >= 300) return colors.info;
  return colors.success;
}

/**
 * Format duration for display
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Log API request to console with formatting
 */
export function logRequest(log: RequestLog): void {
  const methodColor = colors[log.method as keyof typeof colors] || colors.info;
  const statusColor = log.statusCode ? getStatusColor(log.statusCode) : colors.info;

  const timestamp = new Date(log.timestamp).toLocaleTimeString();
  const duration = log.duration ? formatDuration(log.duration) : '-';
  const status = log.statusCode || '-';
  const tenant = log.tenantId ? ` [Tenant: ${log.tenantId.slice(0, 8)}]` : '';
  const user = log.userId ? ` [User: ${log.userId.slice(0, 8)}]` : '';

  // Main log line
  console.log(
    `${colors.dim}[${timestamp}]${colors.reset}`,
    `${methodColor}${log.method.padEnd(6)}${colors.reset}`,
    `${log.path}`,
    `${statusColor}${status}${colors.reset}`,
    `${colors.dim}${duration}${colors.reset}`,
    `${colors.dim}${tenant}${user}${colors.reset}`
  );

  // Query parameters (if any)
  if (Object.keys(log.query).length > 0) {
    console.log(
      `${colors.dim}       Query:${colors.reset}`,
      JSON.stringify(log.query)
    );
  }

  // Error details (if any)
  if (log.error) {
    console.log(
      `${colors.error}       Error:${colors.reset}`,
      log.error
    );
  }
}

/**
 * Create request logger middleware
 */
export class RequestLogger {
  private startTime: number;
  private request: NextRequest;
  private tenantId?: string;
  private userId?: string;

  constructor(request: NextRequest, tenantId?: string, userId?: string) {
    this.startTime = Date.now();
    this.request = request;
    this.tenantId = tenantId;
    this.userId = userId;
  }

  /**
   * Log the request completion
   */
  log(statusCode: number, error?: string): void {
    const duration = Date.now() - this.startTime;
    const url = new URL(this.request.url);
    const query = Object.fromEntries(url.searchParams.entries());

    const log: RequestLog = {
      timestamp: new Date().toISOString(),
      method: this.request.method,
      path: url.pathname,
      query,
      tenantId: this.tenantId,
      userId: this.userId,
      userAgent: this.request.headers.get('user-agent') || undefined,
      ip: this.request.headers.get('x-forwarded-for') ||
          this.request.headers.get('x-real-ip') || undefined,
      duration,
      statusCode,
      error,
    };

    logRequest(log);

    // In production, you could also send logs to external service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to log aggregation service (e.g., DataDog, Sentry, CloudWatch)
      // await sendToLogService(log);
    }
  }

  /**
   * Log success response
   */
  success(statusCode: number = 200): void {
    this.log(statusCode);
  }

  /**
   * Log error response
   */
  error(statusCode: number, error: string): void {
    this.log(statusCode, error);
  }
}

/**
 * Middleware wrapper for automatic request logging
 */
export function withRequestLogging<T extends any[], R>(
  handler: (logger: RequestLogger, ...args: T) => Promise<R>,
  options?: {
    logErrors?: boolean;
    logSuccessBody?: boolean;
  }
) {
  return async (...args: T): Promise<R> => {
    // Extract request from args (assumes first arg is NextRequest)
    const request = args[0] as NextRequest;
    const logger = new RequestLogger(request);

    try {
      const result = await handler(logger, ...args);

      // Extract status code from NextResponse
      if (result && typeof result === 'object' && 'status' in result) {
        logger.success((result as any).status || 200);
      } else {
        logger.success();
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error(500, message);
      throw error;
    }
  };
}

/**
 * Performance monitoring - track slow requests
 */
export class PerformanceMonitor {
  private static slowRequestThreshold = 1000; // 1 second
  private static requests: Map<string, number[]> = new Map();

  static trackRequest(path: string, duration: number): void {
    if (!this.requests.has(path)) {
      this.requests.set(path, []);
    }

    const durations = this.requests.get(path)!;
    durations.push(duration);

    // Keep only last 100 requests per endpoint
    if (durations.length > 100) {
      durations.shift();
    }

    // Warn about slow requests
    if (duration > this.slowRequestThreshold) {
      console.warn(
        `${colors.warning}[Performance Warning]${colors.reset}`,
        `Slow request detected: ${path} took ${formatDuration(duration)}`
      );
    }
  }

  static getStats(path: string): { avg: number; max: number; min: number; count: number } | null {
    const durations = this.requests.get(path);
    if (!durations || durations.length === 0) return null;

    return {
      avg: durations.reduce((a, b) => a + b, 0) / durations.length,
      max: Math.max(...durations),
      min: Math.min(...durations),
      count: durations.length,
    };
  }

  static getAllStats(): Record<string, ReturnType<typeof this.getStats>> {
    const stats: Record<string, ReturnType<typeof this.getStats>> = {};

    for (const [path] of this.requests) {
      stats[path] = this.getStats(path);
    }

    return stats;
  }
}
