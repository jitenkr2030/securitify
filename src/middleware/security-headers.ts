import { NextResponse } from 'next/server';
import { productionConfig } from '@/lib/production-config';

export function addSecurityHeaders(response: NextResponse) {
  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', productionConfig.security.headers.csp);
  response.headers.set('Permissions-Policy', productionConfig.security.headers.permissionsPolicy);
  
  // Remove server info
  response.headers.set('Server', 'Securitify');
  
  // HSTS (only in production)
  if (productionConfig.app.env === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  return response;
}

export function createSecurityResponse() {
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}