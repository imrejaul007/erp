/**
 * Simple in-memory caching system with TTL support
 * For production, consider using Redis
 */

interface CacheEntry<T> {
  value: T;
  expiry: number;
}

class Cache {
  private store: Map<string, CacheEntry<any>> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start cleanup interval to remove expired entries
    this.startCleanup();
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Set value in cache with TTL (in seconds)
   */
  set<T>(key: string, value: T, ttl: number = 300): void {
    const expiry = Date.now() + ttl * 1000;
    this.store.set(key, { value, expiry });
  }

  /**
   * Delete value from cache
   */
  delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.store.get(key);

    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get or set pattern - fetch from cache or compute and store
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 300
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    const value = await fetcher();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Start cleanup interval
   */
  private startCleanup(): void {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const keysToDelete: string[] = [];

      this.store.forEach((entry, key) => {
        if (now > entry.expiry) {
          keysToDelete.push(key);
        }
      });

      keysToDelete.forEach((key) => this.store.delete(key));
    }, 5 * 60 * 1000);

    // Prevent the interval from keeping the process alive
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref();
    }
  }

  /**
   * Stop cleanup interval
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    this.store.forEach((entry) => {
      if (now > entry.expiry) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    });

    return {
      total: this.store.size,
      valid: validEntries,
      expired: expiredEntries,
    };
  }
}

// Export singleton instance
export const cache = new Cache();

/**
 * Cache key generators for common patterns
 */
export const cacheKeys = {
  user: (userId: string) => `user:${userId}`,
  tenant: (tenantId: string) => `tenant:${tenantId}`,
  product: (productId: string) => `product:${productId}`,
  inventory: (tenantId: string) => `inventory:${tenantId}`,
  customers: (tenantId: string, page: number) => `customers:${tenantId}:page:${page}`,
  orders: (tenantId: string, page: number) => `orders:${tenantId}:page:${page}`,
  dashboard: (tenantId: string) => `dashboard:${tenantId}`,
  analytics: (tenantId: string, type: string) => `analytics:${tenantId}:${type}`,
};

/**
 * Cache TTL constants (in seconds)
 */
export const cacheTTL = {
  short: 60, // 1 minute
  medium: 300, // 5 minutes
  long: 900, // 15 minutes
  hour: 3600, // 1 hour
  day: 86400, // 24 hours
};
