// Advanced Cache Manager with intelligent caching strategies
import { useState, useEffect, useCallback } from 'react';
interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size in bytes
  strategy?: 'lru' | 'lfu' | 'fifo'; // Cache eviction strategy
  compress?: boolean; // Enable compression for cached data
  persist?: boolean; // Persist cache to localStorage
  version?: string; // Cache version for invalidation
}

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
  size: number;
  key: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  entries: number;
  hitRate: number;
  evictions: number;
  compressionRatio: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    entries: 0,
    hitRate: 0,
    evictions: 0,
    compressionRatio: 0,
  };
  private options: Required<CacheOptions>;
  private accessOrder: string[] = [];
  private frequencyMap = new Map<string, number>();

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 50 * 1024 * 1024, // 50MB default
      strategy: options.strategy || 'lru',
      compress: options.compress || false,
      persist: options.persist || false,
      version: options.version || '1.0',
    };

    this.loadFromStorage();
    this.startCleanupTimer();
  }

  // Set cache entry
  set<T>(key: string, data: T, customTTL?: number): void {
    const ttl = customTTL || this.options.ttl;
    const serialized = JSON.stringify(data);
    const size = new Blob([serialized]).size;

    // Check if we need to evict entries
    this.ensureCapacity(size);

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0,
      size,
      key,
    };

    this.cache.set(key, entry);
    this.updateAccessOrder(key);
    this.updateStats();
    this.saveToStorage();
  }

  // Get cache entry
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    // Check if entry is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      this.stats.misses++;
      this.updateStats();
      return null;
    }

    // Update access information
    entry.hits++;
    this.updateAccessOrder(key);
    this.updateFrequency(key);
    this.stats.hits++;
    this.updateStats();

    return entry.data;
  }

  // Delete cache entry
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.accessOrder = this.accessOrder.filter(k => k !== key);
      this.frequencyMap.delete(key);
      this.updateStats();
      this.saveToStorage();
    }
    return deleted;
  }

  // Clear all cache entries
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.frequencyMap.clear();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      entries: 0,
      hitRate: 0,
      evictions: 0,
      compressionRatio: 0,
    };
    this.saveToStorage();
  }

  // Get cache statistics
  getStats(): CacheStats {
    return { ...this.stats };
  }

  // Get all keys in cache
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Check if key exists
  has(key: string): boolean {
    return this.cache.has(key) && this.get(key) !== null;
  }

  // Get entry by key with metadata
  getEntry(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() - entry.timestamp > entry.ttl) {
      return null;
    }
    return entry;
  }

  // Prefetch multiple keys
  async prefetch(keys: string[]): Promise<void> {
    const promises = keys.map(async (key) => {
      if (!this.has(key)) {
        try {
          // Simulate fetching data
          await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
          const mockData = { key, data: `Data for ${key}`, timestamp: Date.now() };
          this.set(key, mockData);
        } catch (error) {
          console.error(`Failed to prefetch ${key}:`, error);
        }
      }
    });

    await Promise.all(promises);
  }

  // Cache invalidation by pattern
  invalidatePattern(pattern: RegExp): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.delete(key);
        count++;
      }
    }
    return count;
  }

  // Cache invalidation by prefix
  invalidatePrefix(prefix: string): number {
    return this.invalidatePattern(new RegExp(`^${prefix}`));
  }

  // Get or set pattern (cache-aside)
  async getOrSet<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    try {
      const data = await fetcher();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      console.error(`Failed to fetch data for key ${key}:`, error);
      throw error;
    }
  }

  // Private methods
  private ensureCapacity(requiredSize: number): void {
    while (this.stats.size + requiredSize > this.options.maxSize && this.cache.size > 0) {
      this.evictEntry();
    }
  }

  private evictEntry(): void {
    if (this.cache.size === 0) return;

    let keyToEvict: string;

    switch (this.options.strategy) {
      case 'lru':
        keyToEvict = this.accessOrder[0];
        break;
      case 'lfu':
        keyToEvict = this.getLeastFrequentlyUsed();
        break;
      case 'fifo':
        keyToEvict = this.accessOrder[0];
        break;
      default:
        keyToEvict = this.accessOrder[0];
    }

    this.delete(keyToEvict);
    this.stats.evictions++;
  }

  private getLeastFrequentlyUsed(): string {
    let minFrequency = Infinity;
    let leastFrequentKey = '';

    for (const [key, frequency] of this.frequencyMap) {
      if (frequency < minFrequency) {
        minFrequency = frequency;
        leastFrequentKey = key;
      }
    }

    return leastFrequentKey;
  }

  private updateAccessOrder(key: string): void {
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);
  }

  private updateFrequency(key: string): void {
    const current = this.frequencyMap.get(key) || 0;
    this.frequencyMap.set(key, current + 1);
  }

  private updateStats(): void {
    this.stats.entries = this.cache.size;
    this.stats.size = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.size, 0);
    this.stats.hitRate = this.stats.hits + this.stats.misses > 0 
      ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100 
      : 0;
  }

  private startCleanupTimer(): void {
    // Clean up expired entries every minute
    setInterval(() => {
      this.cleanupExpired();
    }, 60 * 1000);
  }

  private cleanupExpired(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.delete(key));
  }

  private saveToStorage(): void {
    if (!this.options.persist) return;

    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const data = {
        cache: Array.from(this.cache.entries()),
        stats: this.stats,
        version: this.options.version,
      };

      localStorage.setItem(`cache_${this.options.version}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save cache to storage:', error);
    }
  }

  private loadFromStorage(): void {
    if (!this.options.persist) return;

    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const stored = localStorage.getItem(`cache_${this.options.version}`);
      if (stored) {
        const data = JSON.parse(stored);
        
        if (data.version === this.options.version) {
          this.cache = new Map(data.cache);
          this.stats = data.stats;
          
          // Rebuild access order and frequency map
          this.accessOrder = Array.from(this.cache.keys());
          this.frequencyMap = new Map(
            Array.from(this.cache.keys()).map(key => [key, 0])
          );
        }
      }
    } catch (error) {
      console.error('Failed to load cache from storage:', error);
    }
  }
}

// Factory function for creating cache instances
export function createCache(options?: CacheOptions): CacheManager {
  return new CacheManager(options);
}

// Pre-configured cache instances
export const defaultCache = createCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 10 * 1024 * 1024, // 10MB
  strategy: 'lru',
  persist: true,
});

export const apiCache = createCache({
  ttl: 15 * 60 * 1000, // 15 minutes
  maxSize: 50 * 1024 * 1024, // 50MB
  strategy: 'lru',
  persist: true,
});

export const imageCache = createCache({
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 100 * 1024 * 1024, // 100MB
  strategy: 'lfu',
  persist: true,
});

// React hook for cache management
export function useCache<T>(key: string, fetcher?: () => Promise<T>, ttl?: number) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!fetcher) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiCache.getOrSet(key, fetcher, ttl);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Server-side cache utilities
export class ServerCache {
  private static instance: CacheManager;

  static getInstance(): CacheManager {
    if (!ServerCache.instance) {
      ServerCache.instance = createCache({
        ttl: 30 * 60 * 1000, // 30 minutes
        maxSize: 200 * 1024 * 1024, // 200MB
        strategy: 'lru',
        persist: false,
      });
    }
    return ServerCache.instance;
  }

  static get<T>(key: string): T | null {
    return this.getInstance().get<T>(key);
  }

  static set<T>(key: string, data: T, ttl?: number): void {
    this.getInstance().set(key, data, ttl);
  }

  static invalidate(pattern: RegExp): number {
    return this.getInstance().invalidatePattern(pattern);
  }

  static clear(): void {
    this.getInstance().clear();
  }

  static getStats(): CacheStats {
    return this.getInstance().getStats();
  }
}

// Cache utilities for common patterns
export const cacheUtils = {
  // Generate cache key with parameters
  generateKey: (prefix: string, params: Record<string, any>): string => {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');
    return `${prefix}:${sortedParams}`;
  },

  // Cache with stale-while-revalidate strategy
  staleWhileRevalidate: async <T>(
    key: string,
    fetcher: () => Promise<T>,
    staleTTL: number = 60 * 1000, // 1 minute
    freshTTL: number = 5 * 60 * 1000 // 5 minutes
  ): Promise<T> => {
    const cached = apiCache.get<T>(key);
    
    if (cached) {
      // Return cached data immediately and refresh in background
      fetcher().then(freshData => {
        apiCache.set(key, freshData, freshTTL);
      }).catch(() => {
        // Silent fail for background refresh
      });
      return cached;
    }

    // No cached data, fetch fresh
    const freshData = await fetcher();
    apiCache.set(key, freshData, freshTTL);
    return freshData;
  },

  // Cache with network-first strategy
  networkFirst: async <T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 5 * 60 * 1000
  ): Promise<T> => {
    try {
      const freshData = await fetcher();
      apiCache.set(key, freshData, ttl);
      return freshData;
    } catch (error) {
      const cached = apiCache.get<T>(key);
      if (cached) {
        return cached;
      }
      throw error;
    }
  },
};

export default CacheManager;