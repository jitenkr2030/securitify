import { NextRequest, NextResponse } from 'next/server';
import { productionConfig } from '@/lib/production-config';

interface RateLimitData {
  count: number;
  resetTime: number;
}

// Enhanced rate limiting that works in production
// For production, this should be replaced with Redis-based rate limiting
class RateLimitStore {
  private store: Map<string, RateLimitData> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, data] of this.store.entries()) {
      if (data.resetTime < now) {
        this.store.delete(key);
      }
    }
  }

  get(ip: string): RateLimitData | undefined {
    return this.store.get(ip);
  }

  set(ip: string, data: RateLimitData): void {
    this.store.set(ip, data);
  }

  // For production deployment, this method should be overridden
  // to use Redis or another distributed cache
  isProductionReady(): boolean {
    return process.env.NODE_ENV !== 'production';
  }
}

const rateLimitStore = new RateLimitStore();

export function rateLimit(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             request.headers.get('cf-connecting-ip') || 
             'unknown';
  
  const now = Date.now();
  const windowStart = now - productionConfig.security.rateLimit.windowMs;

  let data = rateLimitStore.get(ip);
  
  if (!data || data.resetTime < now) {
    // New window
    data = {
      count: 1,
      resetTime: now + productionConfig.security.rateLimit.windowMs,
    };
    rateLimitStore.set(ip, data);
    return { 
      success: true, 
      remaining: productionConfig.security.rateLimit.max - 1,
      isProductionReady: rateLimitStore.isProductionReady()
    };
  }

  if (data.count >= productionConfig.security.rateLimit.max) {
    return {
      success: false,
      remaining: 0,
      resetTime: data.resetTime,
      limit: productionConfig.security.rateLimit.max,
      isProductionReady: rateLimitStore.isProductionReady()
    };
  }

  data.count++;
  rateLimitStore.set(ip, data);
  
  return {
    success: true,
    remaining: productionConfig.security.rateLimit.max - data.count,
    resetTime: data.resetTime,
    limit: productionConfig.security.rateLimit.max,
    isProductionReady: rateLimitStore.isProductionReady()
  };
}

export function applyRateLimit(request: NextRequest) {
  const result = rateLimit(request);
  
  if (!result.success) {
    const headers: Record<string, string> = {
      'X-RateLimit-Remaining': result.remaining.toString(),
      'Retry-After': Math.ceil((result.resetTime! - Date.now()) / 1000).toString(),
      'X-RateLimit-Production-Ready': result.isProductionReady.toString(),
    };
    
    if (result.limit) {
      headers['X-RateLimit-Limit'] = result.limit.toString();
    }
    
    if (result.resetTime) {
      headers['X-RateLimit-Reset'] = result.resetTime.toString();
    }

    // Add warning for production
    const warning = !result.isProductionReady ? 
      'WARNING: Using in-memory rate limiting in production. Configure Redis for production deployment.' : 
      undefined;

    return NextResponse.json(
      { 
        error: 'Too many requests', 
        retryAfter: Math.ceil((result.resetTime! - Date.now()) / 1000),
        warning
      },
      { 
        status: 429,
        headers,
      }
    );
  }
  
  // Add rate limit headers to successful responses
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Limit', (result.limit || 100).toString());
  response.headers.set('X-RateLimit-Reset', (result.resetTime || Date.now()).toString());
  response.headers.set('X-RateLimit-Production-Ready', (result.isProductionReady || false).toString());
  
  return null; // No rate limit exceeded
}