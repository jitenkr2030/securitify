import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache for development
// In production, you'd use Redis or similar
class MemoryCache {
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private defaultTTL = 300000; // 5 minutes in milliseconds

  set(key: string, data: any, ttl: number = this.defaultTTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Get all cache keys
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Global cache instance
const cache = new MemoryCache();

// Cache key generator
export function generateCacheKey(prefix: string, ...parts: string[]): string {
  return `${prefix}:${parts.join(':')}`;
}

// Cache middleware for API routes
export function withCache(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    keyPrefix: string;
    ttl?: number;
    varyBy?: string[];
  } = { keyPrefix: 'api' }
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const { keyPrefix, ttl = 300000, varyBy = [] } = options;
    
    // Generate cache key
    const url = new URL(req.url);
    const cacheParts = [keyPrefix, url.pathname];
    
    // Add query parameters to cache key
    url.searchParams.forEach((value, key) => {
      cacheParts.push(`${key}=${value}`);
    });
    
    // Add vary headers to cache key
    if (varyBy.length > 0) {
      varyBy.forEach(header => {
        const value = req.headers.get(header);
        if (value) cacheParts.push(`${header}=${value}`);
      });
    }
    
    const cacheKey = generateCacheKey(cacheParts[0], ...cacheParts.slice(1));
    
    // Try to get from cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': `public, max-age=${Math.floor(ttl / 1000)}`,
        },
      });
    }
    
    // Execute handler
    const response = await handler(req);
    
    // Cache successful GET responses
    if (req.method === 'GET' && response.status === 200) {
      try {
        const clonedResponse = response.clone();
        const data = await clonedResponse.json();
        cache.set(cacheKey, data, ttl);
        
        // Add cache headers to response
        const headers = new Headers(response.headers);
        headers.set('X-Cache', 'MISS');
        headers.set('Cache-Control', `public, max-age=${Math.floor(ttl / 1000)}`);
        
        return new NextResponse(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      } catch (error) {
        // If we can't parse JSON, don't cache
        console.warn('Failed to cache response:', error);
      }
    }
    
    return response;
  };
}

// Database query caching
export function withQueryCache<T>(
  queryFn: () => Promise<T>,
  key: string,
  ttl: number = 300000
): () => Promise<T> {
  return async (): Promise<T> => {
    const cached = cache.get(key);
    if (cached) {
      return cached;
    }
    
    const result = await queryFn();
    cache.set(key, result, ttl);
    return result;
  };
}

// Cache invalidation helpers
export function invalidateCachePattern(pattern: string): void {
  const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
}

export function invalidateCacheKey(key: string): void {
  cache.delete(key);
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private thresholds: Map<string, number> = new Map();

  constructor() {
    // Set default thresholds (in milliseconds)
    this.thresholds.set('api', 1000); // 1 second for API calls
    this.thresholds.set('database', 500); // 500ms for database queries
    this.thresholds.set('cache', 50); // 50ms for cache operations
  }

  recordMetric(name: string, duration: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);

    // Check if threshold is exceeded
    const threshold = this.thresholds.get(name);
    if (threshold && duration > threshold) {
      console.warn(`Performance threshold exceeded for ${name}: ${duration}ms > ${threshold}ms`);
    }
  }

  async measure<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(`${name}_error`, duration);
      throw error;
    }
  }

  getMetrics(name: string): { avg: number; min: number; max: number; count: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
    };
  }

  getAllMetrics(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const result: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      if (values.length > 0) {
        result[name] = {
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length,
        };
      }
    }
    
    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Request rate limiting
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs; // 1 minute window
    this.maxRequests = maxRequests;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const userRequests = this.requests.get(key)!;
    
    // Remove old requests
    const validRequests = userRequests.filter(time => time > windowStart);
    this.requests.set(key, validRequests);
    
    // Check if limit exceeded
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    return true;
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(key)) {
      return this.maxRequests;
    }
    
    const userRequests = this.requests.get(key)!;
    const validRequests = userRequests.filter(time => time > windowStart);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

// Response compression helper
export function compressResponse(data: any): string {
  if (typeof data === 'string') {
    // Simple compression for JSON strings
    // In production, you'd use proper compression like gzip
    return JSON.stringify(data);
  }
  return JSON.stringify(data);
}

// Cache utility functions
export const cacheUtils = {
  generateKey: generateCacheKey,
  invalidatePattern: invalidateCachePattern,
  invalidateKey: invalidateCacheKey,
  clear: () => cache.clear(),
  cleanup: () => cache.cleanup(),
  getStats: () => ({
    size: cache.keys().length,
    keys: cache.keys(),
  }),
};

// Export cache instance for advanced usage
export { cache };