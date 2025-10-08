import { NextRequest, NextResponse } from 'next/server';
import { productionConfig } from '@/lib/production-config';

interface RateLimitData {
  count: number;
  resetTime: number;
}

// Simple in-memory rate limiting (for production, use Redis)
const rateLimitStore = new Map<string, RateLimitData>();

export function rateLimit(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             request.headers.get('cf-connecting-ip') || 
             'unknown';
  const now = Date.now();
  const windowStart = now - productionConfig.security.rateLimit.windowMs;

  // Clean old entries
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }

  let data = rateLimitStore.get(ip);
  
  if (!data || data.resetTime < now) {
    // New window
    data = {
      count: 1,
      resetTime: now + productionConfig.security.rateLimit.windowMs,
    };
    rateLimitStore.set(ip, data);
    return { success: true, remaining: productionConfig.security.rateLimit.max - 1 };
  }

  if (data.count >= productionConfig.security.rateLimit.max) {
    return {
      success: false,
      remaining: 0,
      resetTime: data.resetTime,
      limit: productionConfig.security.rateLimit.max,
    };
  }

  data.count++;
  rateLimitStore.set(ip, data);
  
  return {
    success: true,
    remaining: productionConfig.security.rateLimit.max - data.count,
    resetTime: data.resetTime,
    limit: productionConfig.security.rateLimit.max,
  };
}

export function applyRateLimit(request: NextRequest) {
  const result = rateLimit(request);
  
  if (!result.success) {
    const headers: Record<string, string> = {
      'X-RateLimit-Remaining': result.remaining.toString(),
      'Retry-After': Math.ceil((result.resetTime! - Date.now()) / 1000).toString(),
    };
    
    if (result.limit) {
      headers['X-RateLimit-Limit'] = result.limit.toString();
    }
    
    if (result.resetTime) {
      headers['X-RateLimit-Reset'] = result.resetTime.toString();
    }

    return NextResponse.json(
      { error: 'Too many requests', retryAfter: Math.ceil((result.resetTime! - Date.now()) / 1000) },
      { 
        status: 429,
        headers,
      }
    );
  }
  
  return null; // No rate limit exceeded
}