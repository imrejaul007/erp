interface RateLimiterOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Number of unique tokens per interval
}

interface TokenData {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private tokens: Map<string, TokenData> = new Map();
  private interval: number;
  private uniqueTokenPerInterval: number;

  constructor(options: RateLimiterOptions) {
    this.interval = options.interval;
    this.uniqueTokenPerInterval = options.uniqueTokenPerInterval;

    // Cleanup expired tokens every minute
    setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  async check(token: string, limit: number = 1): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const now = Date.now();
    const tokenData = this.tokens.get(token);

    if (!tokenData || now > tokenData.resetTime) {
      // New window or expired
      const resetTime = now + this.interval;
      this.tokens.set(token, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime,
      };
    }

    if (tokenData.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: tokenData.resetTime,
      };
    }

    // Increment count
    tokenData.count++;
    this.tokens.set(token, tokenData);

    return {
      allowed: true,
      remaining: limit - tokenData.count,
      resetTime: tokenData.resetTime,
    };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [token, data] of this.tokens.entries()) {
      if (now > data.resetTime) {
        this.tokens.delete(token);
      }
    }

    // If we have too many tokens, remove the oldest ones
    if (this.tokens.size > this.uniqueTokenPerInterval) {
      const entries = Array.from(this.tokens.entries());
      entries.sort((a, b) => a[1].resetTime - b[1].resetTime);

      const toRemove = entries.slice(0, entries.length - this.uniqueTokenPerInterval);
      for (const [token] of toRemove) {
        this.tokens.delete(token);
      }
    }
  }

  getStats(): {
    activeTokens: number;
    totalRequests: number;
  } {
    let totalRequests = 0;
    for (const data of this.tokens.values()) {
      totalRequests += data.count;
    }

    return {
      activeTokens: this.tokens.size,
      totalRequests,
    };
  }

  reset(token?: string): void {
    if (token) {
      this.tokens.delete(token);
    } else {
      this.tokens.clear();
    }
  }
}