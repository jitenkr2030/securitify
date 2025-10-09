// Cache strategy definitions and configurations
import CacheManager from './cache-manager';
import { createCache } from './cache-manager';

export interface CacheStrategy {
  name: string;
  description: string;
  ttl: number;
  maxSize: number;
  strategy: 'lru' | 'lfu' | 'fifo';
  useCompression: boolean;
  persistToStorage: boolean;
  invalidationRules: InvalidationRule[];
}

export interface InvalidationRule {
  type: 'time' | 'size' | 'pattern' | 'manual';
  condition: string | RegExp | number;
  action: 'evict' | 'refresh' | 'compress';
}

export interface CacheConfig {
  strategies: Record<string, CacheStrategy>;
  global: {
    defaultStrategy: string;
    enableCompression: boolean;
    enablePersistence: boolean;
    cleanupInterval: number;
    maxMemoryUsage: number;
  };
}

// Predefined cache strategies
export const CACHE_STRATEGIES: Record<string, CacheStrategy> = {
  // API Response Cache
  api: {
    name: 'API Response Cache',
    description: 'Cache for API responses with moderate TTL',
    ttl: 15 * 60 * 1000, // 15 minutes
    maxSize: 50 * 1024 * 1024, // 50MB
    strategy: 'lru',
    useCompression: true,
    persistToStorage: true,
    invalidationRules: [
      {
        type: 'time',
        condition: 15 * 60 * 1000,
        action: 'evict'
      }
    ]
  },

  // User Session Cache
  session: {
    name: 'User Session Cache',
    description: 'Cache for user session data',
    ttl: 30 * 60 * 1000, // 30 minutes
    maxSize: 5 * 1024 * 1024, // 5MB
    strategy: 'lru',
    useCompression: false,
    persistToStorage: true,
    invalidationRules: [
      {
        type: 'manual',
        condition: 'logout',
        action: 'evict'
      }
    ]
  },

  // Image Cache
  images: {
    name: 'Image Cache',
    description: 'Cache for optimized images',
    ttl: 24 * 60 * 60 * 1000, // 24 hours
    maxSize: 200 * 1024 * 1024, // 200MB
    strategy: 'lfu',
    useCompression: true,
    persistToStorage: true,
    invalidationRules: [
      {
        type: 'size',
        condition: 200 * 1024 * 1024,
        action: 'evict'
      }
    ]
  },

  // Document Cache
  documents: {
    name: 'Document Cache',
    description: 'Cache for documents and files',
    ttl: 2 * 60 * 60 * 1000, // 2 hours
    maxSize: 100 * 1024 * 1024, // 100MB
    strategy: 'fifo',
    useCompression: true,
    persistToStorage: true,
    invalidationRules: [
      {
        type: 'pattern',
        condition: /^\/api\/documents\/.*\.pdf$/,
        action: 'evict'
      }
    ]
  },

  // Analytics Cache
  analytics: {
    name: 'Analytics Cache',
    description: 'Cache for analytics data',
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 20 * 1024 * 1024, // 20MB
    strategy: 'lru',
    useCompression: true,
    persistToStorage: false,
    invalidationRules: [
      {
        type: 'time',
        condition: 5 * 60 * 1000,
        action: 'refresh'
      }
    ]
  },

  // Search Results Cache
  search: {
    name: 'Search Results Cache',
    description: 'Cache for search results',
    ttl: 10 * 60 * 1000, // 10 minutes
    maxSize: 30 * 1024 * 1024, // 30MB
    strategy: 'lru',
    useCompression: true,
    persistToStorage: false,
    invalidationRules: [
      {
        type: 'pattern',
        condition: /^search_/,
        action: 'evict'
      }
    ]
  },

  // Static Assets Cache
  static: {
    name: 'Static Assets Cache',
    description: 'Cache for static assets and resources',
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxSize: 500 * 1024 * 1024, // 500MB
    strategy: 'lfu',
    useCompression: false,
    persistToStorage: true,
    invalidationRules: [
      {
        type: 'time',
        condition: 7 * 24 * 60 * 60 * 1000,
        action: 'evict'
      }
    ]
  }
};

// Default cache configuration
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  strategies: CACHE_STRATEGIES,
  global: {
    defaultStrategy: 'api',
    enableCompression: true,
    enablePersistence: true,
    cleanupInterval: 60 * 1000, // 1 minute
    maxMemoryUsage: 1024 * 1024 * 1024, // 1GB
  }
};

// Cache Strategy Manager
export class CacheStrategyManager {
  private config: CacheConfig;
  private caches: Map<string, CacheManager> = new Map();
  private cleanupInterval?: NodeJS.Timeout;

  constructor(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
    this.config = config;
    this.initializeCaches();
    this.startCleanupProcess();
  }

  private initializeCaches(): void {
    Object.entries(this.config.strategies).forEach(([key, strategy]) => {
      const cache = createCache({
        ttl: strategy.ttl,
        maxSize: strategy.maxSize,
        strategy: strategy.strategy,
        compress: strategy.useCompression,
        persist: strategy.persistToStorage,
      });
      this.caches.set(key, cache);
    });
  }

  private startCleanupProcess(): void {
    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, this.config.global.cleanupInterval);
  }

  private performCleanup(): void {
    this.caches.forEach((cache, strategyName) => {
      const strategy = this.config.strategies[strategyName];
      
      strategy.invalidationRules.forEach(rule => {
        switch (rule.type) {
          case 'time':
            this.handleTimeInvalidation(cache, rule);
            break;
          case 'size':
            this.handleSizeInvalidation(cache, rule);
            break;
          case 'pattern':
            this.handlePatternInvalidation(cache, rule);
            break;
          case 'manual':
            // Manual invalidation is handled by explicit calls
            break;
        }
      });
    });
  }

  private handleTimeInvalidation(cache: CacheManager, rule: InvalidationRule): void {
    if (typeof rule.condition === 'number') {
      const now = Date.now();
      const condition = rule.condition; // Type is now narrowed to number
      cache.keys().forEach(key => {
        const entry = cache.getEntry(key);
        if (entry && now - entry.timestamp > condition) {
          if (rule.action === 'evict') {
            cache.delete(key);
          } else if (rule.action === 'refresh') {
            // Trigger refresh logic here
          }
        }
      });
    }
  }

  private handleSizeInvalidation(cache: CacheManager, rule: InvalidationRule): void {
    if (typeof rule.condition === 'number') {
      const stats = cache.getStats();
      if (stats.size > rule.condition) {
        // Evict oldest entries until under limit
        while (stats.size > rule.condition && cache.keys().length > 0) {
          const oldestKey = cache.keys()[0];
          cache.delete(oldestKey);
          const newStats = cache.getStats();
          stats.size = newStats.size;
        }
      }
    }
  }

  private handlePatternInvalidation(cache: CacheManager, rule: InvalidationRule): void {
    if (rule.condition instanceof RegExp) {
      const pattern = rule.condition; // Type is now narrowed to RegExp
      const keys = cache.keys();
      keys.forEach(key => {
        if (pattern.test(key)) {
          if (rule.action === 'evict') {
            cache.delete(key);
          }
        }
      });
    }
  }

  // Public API
  getCache(strategyName: string = this.config.global.defaultStrategy): CacheManager {
    const cache = this.caches.get(strategyName);
    if (!cache) {
      throw new Error(`Cache strategy '${strategyName}' not found`);
    }
    return cache;
  }

  getStrategy(strategyName: string): CacheStrategy {
    const strategy = this.config.strategies[strategyName];
    if (!strategy) {
      throw new Error(`Cache strategy '${strategyName}' not found`);
    }
    return strategy;
  }

  getAllStrategies(): Record<string, CacheStrategy> {
    return { ...this.config.strategies };
  }

  getStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    this.caches.forEach((cache, strategyName) => {
      stats[strategyName] = {
        strategy: this.config.strategies[strategyName],
        cacheStats: cache.getStats(),
      };
    });

    return stats;
  }

  invalidateStrategy(strategyName: string, pattern?: RegExp): number {
    const cache = this.getCache(strategyName);
    if (pattern) {
      return cache.invalidatePattern(pattern);
    }
    cache.clear();
    return cache.keys().length;
  }

  updateStrategy(strategyName: string, updates: Partial<CacheStrategy>): void {
    if (!this.config.strategies[strategyName]) {
      throw new Error(`Cache strategy '${strategyName}' not found`);
    }

    this.config.strategies[strategyName] = {
      ...this.config.strategies[strategyName],
      ...updates,
    };

    // Reinitialize cache with new configuration
    const newCache = createCache({
      ttl: this.config.strategies[strategyName].ttl,
      maxSize: this.config.strategies[strategyName].maxSize,
      strategy: this.config.strategies[strategyName].strategy,
      compress: this.config.strategies[strategyName].useCompression,
      persist: this.config.strategies[strategyName].persistToStorage,
    });

    this.caches.set(strategyName, newCache);
  }

  addStrategy(name: string, strategy: CacheStrategy): void {
    this.config.strategies[name] = strategy;
    
    const cache = createCache({
      ttl: strategy.ttl,
      maxSize: strategy.maxSize,
      strategy: strategy.strategy,
      compress: strategy.useCompression,
      persist: strategy.persistToStorage,
    });

    this.caches.set(name, cache);
  }

  removeStrategy(name: string): void {
    if (name === this.config.global.defaultStrategy) {
      throw new Error('Cannot remove default cache strategy');
    }

    delete this.config.strategies[name];
    this.caches.delete(name);
  }

  setDefaultStrategy(name: string): void {
    if (!this.config.strategies[name]) {
      throw new Error(`Cache strategy '${name}' not found`);
    }
    this.config.global.defaultStrategy = name;
  }

  cleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.caches.forEach(cache => cache.clear());
    this.caches.clear();
  }
}

// Global cache strategy manager instance
export const cacheStrategyManager = new CacheStrategyManager();

// Utility functions for common cache operations
export const cacheHelpers = {
  // Generate cache key with context
  generateKey: (context: string, ...parts: string[]): string => {
    return [context, ...parts].join(':');
  },

  // Cache API responses with automatic strategy selection
  cacheApiResponse: async <T>(
    endpoint: string,
    params: Record<string, any>,
    fetcher: () => Promise<T>,
    strategy: string = 'api'
  ): Promise<T> => {
    const cache = cacheStrategyManager.getCache(strategy);
    const key = cacheHelpers.generateKey('api', endpoint, JSON.stringify(params));
    
    return cache.getOrSet(key, fetcher);
  },

  // Cache user data with session strategy
  cacheUserData: <T>(key: string, data: T, strategy: string = 'session'): void => {
    const cache = cacheStrategyManager.getCache(strategy);
    cache.set(cacheHelpers.generateKey('user', key), data);
  },

  // Get cached user data
  getUserData: <T>(key: string, strategy: string = 'session'): T | null => {
    const cache = cacheStrategyManager.getCache(strategy);
    return cache.get<T>(cacheHelpers.generateKey('user', key));
  },

  // Clear user-specific cache
  clearUserCache: (userId: string): void => {
    const userPattern = new RegExp(`^user:${userId}:`);
    ['session', 'api', 'search'].forEach(strategy => {
      try {
        cacheStrategyManager.invalidateStrategy(strategy, userPattern);
      } catch (error) {
        console.error(`Failed to clear user cache for strategy ${strategy}:`, error);
      }
    });
  },

  // Prefetch data for better performance
  prefetchData: async (
    keys: string[],
    strategy: string = 'api'
  ): Promise<void> => {
    const cache = cacheStrategyManager.getCache(strategy);
    await cache.prefetch(keys);
  },

  // Cache with fallback strategy
  cacheWithFallback: async <T>(
    key: string,
    fetcher: () => Promise<T>,
    strategies: string[] = ['api', 'session']
  ): Promise<T> => {
    for (const strategy of strategies) {
      try {
        const cache = cacheStrategyManager.getCache(strategy);
        const cached = cache.get<T>(key);
        if (cached) {
          return cached;
        }
      } catch (error) {
        console.warn(`Failed to get from cache strategy ${strategy}:`, error);
      }
    }

    // Fallback to fresh data
    const freshData = await fetcher();
    const primaryCache = cacheStrategyManager.getCache(strategies[0]);
    primaryCache.set(key, freshData);
    
    return freshData;
  },
};

export default CacheStrategyManager;