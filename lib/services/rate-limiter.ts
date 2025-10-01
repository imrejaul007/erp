import { Redis } from '@upstash/redis';

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

export class RateLimiter {
  private redis: Redis;

  constructor() {
    // Initialize Redis connection for rate limiting
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || 'redis://localhost:6379',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
    });
  }

  async checkLimit(
    userId: string,
    operation: string = 'default',
    customLimit?: RateLimitConfig
  ): Promise<boolean> {
    try {
      const config = customLimit || RATE_LIMITS[operation] || RATE_LIMITS.default;
      const key = `rate_limit:${userId}:${operation}`;
      const now = Math.floor(Date.now() / 1000);
      const window = config.window;
      const limit = config.requests;

      // Use Redis sliding window log
      const pipeline = this.redis.pipeline();

      // Remove old entries
      pipeline.zremrangebyscore(key, 0, now - window);

      // Count current entries
      pipeline.zcard(key);

      // Add current request
      pipeline.zadd(key, now, `${now}-${Math.random()}`);

      // Set expiration
      pipeline.expire(key, window);

      const results = await pipeline.exec();
      const currentCount = results[1] as number;

      return currentCount < limit;
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
      const key = `rate_limit:${userId}:${operation}`;
      const now = Math.floor(Date.now() / 1000);
      const window = config.window;
      const limit = config.requests;

      // Remove old entries and count current
      await this.redis.zremrangebyscore(key, 0, now - window);
      const currentCount = await this.redis.zcard(key);

      return {
        remaining: Math.max(0, limit - currentCount),
        resetTime: now + window
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