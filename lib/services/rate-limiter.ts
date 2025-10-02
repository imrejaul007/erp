// In-memory rate limiter (for development - use Redis in production)
interface RateLimitConfig {
  requests: number;
  window: number; // in seconds
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  api_gateway: { requests: 1000, window: 3600 }, // 1000 requests per hour
  search: { requests: 100, window: 300 }, // 100 searches per 5 minutes
  backup: { requests: 5, window: 3600 }, // 5 backup operations per hour
  notification: { requests: 500, window: 3600 }, // 500 notifications per hour
  default: { requests: 200, window: 3600 } // Default: 200 requests per hour
};

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export class RateLimiter {
  constructor() {
    // In-memory rate limiter (upgrade to Redis for production)
  }

  async checkLimit(
    userId: string,
    operation: string = 'default',
    customLimit?: RateLimitConfig
  ): Promise<boolean> {
    try {
      const config = customLimit || RATE_LIMITS[operation] || RATE_LIMITS.default;
      const key = `${userId}:${operation}`;
      const now = Date.now();
      const resetTime = now + config.window * 1000;

      // Get or create rate limit entry
      const entry = rateLimitStore.get(key);

      // Reset if window has passed
      if (!entry || now > entry.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime });
        return true;
      }

      // Check if limit exceeded
      if (entry.count >= config.requests) {
        return false;
      }

      // Increment count
      entry.count++;
      rateLimitStore.set(key, entry);
      return true;
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Fail open - allow request if rate limiter fails
      return true;
    }
  }

  async getRemainingRequests(
    userId: string,
    operation: string = 'default'
  ): Promise<{ remaining: number; resetTime: number }> {
    try {
      const config = RATE_LIMITS[operation] || RATE_LIMITS.default;
      const key = `${userId}:${operation}`;
      const now = Date.now();

      const entry = rateLimitStore.get(key);

      if (!entry || now > entry.resetTime) {
        return {
          remaining: config.requests,
          resetTime: now + config.window * 1000,
        };
      }

      const currentCount = entry.count;

      return {
        remaining: Math.max(0, config.requests - currentCount),
        resetTime: entry.resetTime
      };
    } catch (error) {
      console.error('Rate limiter status error:', error);
      return { remaining: 0, resetTime: Math.floor(Date.now() / 1000) + 3600 };
    }
  }

  async resetLimit(userId: string, operation: string = 'default'): Promise<void> {
    try {
      const key = `rate_limit:${userId}:${operation}`;
      await this.redis.del(key);
    } catch (error) {
      console.error('Rate limiter reset error:', error);
    }
  }

  async isBlocked(userId: string, operation: string = 'default'): Promise<boolean> {
    const isAllowed = await this.checkLimit(userId, operation);
    return !isAllowed;
  }

  // Bulk check for multiple operations
  async checkMultipleOperations(
    userId: string,
    operations: string[]
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const operation of operations) {
      results[operation] = await this.checkLimit(userId, operation);
    }

    return results;
  }

  // Get statistics for monitoring
  async getStats(operation: string = 'default'): Promise<{
    totalUsers: number;
    activeUsers: number;
    blockedUsers: number;
  }> {
    try {
      const pattern = `rate_limit:*:${operation}`;
      const keys = await this.redis.keys(pattern);
      const now = Math.floor(Date.now() / 1000);
      const window = (RATE_LIMITS[operation] || RATE_LIMITS.default).window;
      const limit = (RATE_LIMITS[operation] || RATE_LIMITS.default).requests;

      let activeUsers = 0;
      let blockedUsers = 0;

      for (const key of keys) {
        await this.redis.zremrangebyscore(key, 0, now - window);
        const count = await this.redis.zcard(key);

        if (count > 0) {
          activeUsers++;
          if (count >= limit) {
            blockedUsers++;
          }
        }
      }

      return {
        totalUsers: keys.length,
        activeUsers,
        blockedUsers
      };
    } catch (error) {
      console.error('Rate limiter stats error:', error);
      return { totalUsers: 0, activeUsers: 0, blockedUsers: 0 };
    }
  }
}