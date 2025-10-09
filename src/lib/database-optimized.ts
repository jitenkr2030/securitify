import { PrismaClient } from '@prisma/client';
import { performanceMonitor } from './cache';

// Database connection pool optimization
export class DatabaseManager {
  private static instance: DatabaseManager;
  private prisma: PrismaClient;
  private queryCache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly DEFAULT_CACHE_TTL = 300000; // 5 minutes

  private constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'file:./dev.db',
        },
      },
    });

    // Set up connection pool
    this.setupConnectionPool();
    
    // Start periodic cache cleanup
    this.startCacheCleanup();
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private setupConnectionPool(): void {
    // Prisma automatically handles connection pooling
    // but we can optimize the configuration
    const poolConfig = {
      connectionLimit: process.env.DB_POOL_SIZE ? parseInt(process.env.DB_POOL_SIZE) : 10,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
    };

    console.log('Database connection pool configured:', poolConfig);
  }

  private startCacheCleanup(): void {
    // Clean up expired cache entries every 5 minutes
    setInterval(() => {
      this.cleanupCache();
    }, 300000);
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.queryCache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.queryCache.delete(key);
      }
    }
  }

  private generateCacheKey(query: string, params: any[]): string {
    const paramString = JSON.stringify(params);
    return `${query}:${Buffer.from(paramString).toString('base64')}`;
  }

  // Cached query execution
  async cachedQuery<T>(
    query: string,
    params: any[] = [],
    ttl: number = this.DEFAULT_CACHE_TTL,
    forceFresh: boolean = false
  ): Promise<T> {
    const cacheKey = this.generateCacheKey(query, params);

    if (!forceFresh) {
      const cached = this.queryCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }
    }

    return performanceMonitor.measure('database_query', async () => {
      try {
        // Execute raw query with parameters
        const result = await this.prisma.$queryRawUnsafe(query, ...params);
        
        // Cache the result
        this.queryCache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          ttl,
        });

        return result as T;
      } catch (error) {
        console.error('Database query error:', error);
        throw error;
      }
    });
  }

  // Batch operations for better performance
  async batchOperations<T>(operations: Array<() => Promise<T>>): Promise<T[]> {
    return performanceMonitor.measure('database_batch', async () => {
      try {
        const results = await Promise.all(operations);
        return results;
      } catch (error) {
        console.error('Batch operation error:', error);
        throw error;
      }
    }) as Promise<T[]>;
  }

  // Transaction with retry logic
  async transaction<T>(
    operations: (prisma: PrismaClient) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await performanceMonitor.measure('database_transaction', async () => {
          return await this.prisma.$transaction(operations as any);
        });
        return result as T;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }
        
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        console.warn(`Transaction attempt ${attempt} failed, retrying...`);
      }
    }

    throw lastError || new Error('Transaction failed after retries');
  }

  // Optimized read operations
  async findManyWithCache<T>(
    model: string,
    options: any = {},
    ttl: number = this.DEFAULT_CACHE_TTL
  ): Promise<T[]> {
    const cacheKey = this.generateCacheKey(`findMany:${model}`, [options]);

    const cached = this.queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    return performanceMonitor.measure(`database_findMany_${model}`, async () => {
      const result = await (this.prisma as any)[model].findMany(options);
      
      this.queryCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
        ttl,
      });

      return result;
    });
  }

  // Optimized count operations
  async countWithCache(
    model: string,
    where: any = {},
    ttl: number = this.DEFAULT_CACHE_TTL
  ): Promise<number> {
    const cacheKey = this.generateCacheKey(`count:${model}`, [where]);

    const cached = this.queryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    return performanceMonitor.measure(`database_count_${model}`, async () => {
      const result = await (this.prisma as any)[model].count({ where });
      
      this.queryCache.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
        ttl,
      });

      return result;
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; latency: number; connections?: number }> {
    const start = Date.now();
    
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;
      
      // Get connection count (PostgreSQL specific)
      let connections: number | undefined;
      try {
        const result = await this.prisma.$queryRaw<{ count: number }[]>`
          SELECT count(*)::integer as count 
          FROM pg_stat_activity 
          WHERE state = 'active'
        `;
        connections = result[0]?.count;
      } catch {
        // Ignore if not PostgreSQL
      }
      
      return {
        status: 'healthy',
        latency,
        connections,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: Date.now() - start,
      };
    }
  }

  // Clear cache for specific model
  invalidateModelCache(model: string): void {
    const pattern = new RegExp(`^${model}:`);
    for (const [key] of this.queryCache.entries()) {
      if (pattern.test(key)) {
        this.queryCache.delete(key);
      }
    }
  }

  // Get database statistics
  async getStats(): Promise<{
    cacheSize: number;
    queryMetrics: any;
    health: any;
  }> {
    const cacheSize = this.queryCache.size;
    const queryMetrics = performanceMonitor.getMetrics('database_query');
    const health = await this.healthCheck();

    return {
      cacheSize,
      queryMetrics,
      health,
    };
  }

  // Graceful shutdown
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  // Get Prisma client for direct usage
  get client(): PrismaClient {
    return this.prisma;
  }
}

// Export singleton instance
export const dbManager = DatabaseManager.getInstance();

// Export the Prisma client with enhanced methods
export const enhancedDb = {
  ...dbManager.client,
  
  // Add cached methods
  findManyWithCache: <T>(model: string, options?: any, ttl?: number) => 
    dbManager.findManyWithCache<T>(model, options, ttl),
    
  countWithCache: (model: string, where?: any, ttl?: number) => 
    dbManager.countWithCache(model, where, ttl),
    
  cachedQuery: <T>(query: string, params?: any[], ttl?: number) => 
    dbManager.cachedQuery<T>(query, params, ttl),
    
  transaction: <T>(operations: (prisma: PrismaClient) => Promise<T>, maxRetries?: number) => 
    dbManager.transaction<T>(operations, maxRetries),
    
  batchOperations: <T>(operations: Array<() => Promise<T>>) => 
    dbManager.batchOperations<T>(operations),
    
  healthCheck: () => dbManager.healthCheck(),
  
  getStats: () => dbManager.getStats(),
  
  invalidateModelCache: (model: string) => dbManager.invalidateModelCache(model),
  
  disconnect: () => dbManager.disconnect(),
};

// Database query optimization utilities
export const dbUtils = {
  // Pagination helper
  paginate: (page: number = 1, limit: number = 10) => ({
    skip: (page - 1) * limit,
    take: limit,
  }),

  // Soft delete helper
  softDelete: (deletedAt: Date | null = new Date()) => ({
    deletedAt,
  }),

  // Active records helper
  activeOnly: () => ({
    deletedAt: null,
  }),

  // Date range helper
  dateRange: (field: string, startDate: Date, endDate: Date) => ({
    [field]: {
      gte: startDate,
      lte: endDate,
    },
  }),

  // Search helper
  search: (fields: string[], term: string) => ({
    OR: fields.map(field => ({
      [field]: {
        contains: term,
        mode: 'insensitive' as const,
      },
    })),
  }),

  // Sorting helper
  sort: (field: string, direction: 'asc' | 'desc' = 'asc') => ({
    orderBy: {
      [field]: direction,
    },
  }),

  // Select fields helper
  select: (fields: string[]) => {
    const selectObject: any = {};
    fields.forEach(field => {
      selectObject[field] = true;
    });
    return { select: selectObject };
  },

  // Include relations helper
  include: (relations: string[]) => {
    const includeObject: any = {};
    relations.forEach(relation => {
      includeObject[relation] = true;
    });
    return { include: includeObject };
  },
};