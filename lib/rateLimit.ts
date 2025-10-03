import { NextRequest, NextResponse } from 'next/server';
import { AppError, ErrorCode } from './errorHandler';

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Maximum requests per window
  message?: string;      // Custom error message
  skipSuccessfulRequests?: boolean;  // Don't count successful requests
  skipFailedRequests?: boolean;      // Don't count failed requests
}

/**
 * Rate limit store - tracks requests per identifier
 */
class RateLimitStore {
  private store: Map<string, { count: number; resetTime: number }> = new Map();

  /**
   * Check if identifier has exceeded rate limit
   */
  check(identifier: string, config: RateLimitConfig): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const record = this.store.get(identifier);

    // No record or window expired - allow request
    if (!record || now > record.resetTime) {
      const resetTime = now + config.windowMs;
      this.store.set(identifier, { count: 1, resetTime });

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime,
      };
    }

    // Within window - check if limit exceeded
    if (record.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
      };
    }

    // Increment count and allow
    record.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - record.count,
      resetTime: record.resetTime,
    };
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string): void {
    this.store.delete(identifier);
  }

  /**
   * Clean up expired records
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Global store instance
const globalStore = new RateLimitStore();

// Run cleanup every minute
if (typeof setInterval !== 'undefined') {
  setInterval(() => globalStore.cleanup(), 60 * 1000);
}

/**
 * Extract rate limit identifier from request
 */
function getRateLimitIdentifier(request: NextRequest, tenantId?: string): string {
  // Use tenant ID if available for tenant-specific rate limits
  if (tenantId) {
    return `tenant:${tenantId}`;
  }

  // Use IP address as fallback
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown';

  return `ip:${ip}`;
}

/**
 * Rate limit middleware for API routes
 */
export function rateLimit(config: RateLimitConfig) {
  return async (
    request: NextRequest,
    tenantId?: string
  ): Promise<NextResponse | null> => {
    const identifier = getRateLimitIdentifier(request, tenantId);
    const result = globalStore.check(identifier, config);

    // Add rate limit headers
    const headers = {
      'X-RateLimit-Limit': config.maxRequests.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
    };

    // Rate limit exceeded
    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);

      throw new AppError(
        config.message || 'Too many requests, please try again later',
        ErrorCode.RATE_LIMIT_EXCEEDED,
        429,
        {
          retryAfter,
          limit: config.maxRequests,
          window: `${config.windowMs / 1000}s`,
        }
      );
    }

    // Request allowed - return null to continue
    return null;
  };
}

/**
 * Predefined rate limit configurations
 */
export const RateLimits = {
  /**
   * Strict rate limit for authentication endpoints
   * 5 requests per minute per IP
   */
  auth: (): ReturnType<typeof rateLimit> => rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    message: 'Too many authentication attempts, please try again later',
  }),

  /**
   * Standard rate limit for API endpoints
   * 100 requests per minute per tenant
   */
  api: (): ReturnType<typeof rateLimit> => rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    message: 'API rate limit exceeded, please slow down',
  }),

  /**
   * Generous rate limit for read-only endpoints
   * 300 requests per minute per tenant
   */
  readOnly: (): ReturnType<typeof rateLimit> => rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 300,
  }),

  /**
   * Strict rate limit for write operations
   * 30 requests per minute per tenant
   */
  write: (): ReturnType<typeof rateLimit> => rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    message: 'Too many write operations, please slow down',
  }),

  /**
   * Very strict rate limit for expensive operations
   * 10 requests per 5 minutes per tenant
   */
  expensive: (): ReturnType<typeof rateLimit> => rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 10,
    message: 'This operation has a rate limit. Please try again later',
  }),
};

/**
 * Rate limit wrapper for withTenant middleware
 */
export function withRateLimit(
  rateLimitFn: ReturnType<typeof rateLimit>
) {
  return async (request: NextRequest, context: { tenantId: string; user: any }) => {
    await rateLimitFn(request, context.tenantId);
  };
}

/**
 * Check rate limit without throwing (for manual handling)
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  tenantId?: string
): { allowed: boolean; remaining: number; resetTime: number } {
  const identifier = getRateLimitIdentifier(request, tenantId);
  return globalStore.check(identifier, config);
}

/**
 * Reset rate limit for a specific tenant/IP
 */
export function resetRateLimit(request: NextRequest, tenantId?: string): void {
  const identifier = getRateLimitIdentifier(request, tenantId);
  globalStore.reset(identifier);
}

/**
 * Get rate limit status for monitoring
 */
export function getRateLimitStatus(): {
  totalIdentifiers: number;
  cleanupEnabled: boolean;
} {
  return {
    totalIdentifiers: (globalStore as any).store.size,
    cleanupEnabled: true,
  };
}
