import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { applyRateLimit } from "@/middleware/rate-limit";
import { addSecurityHeaders } from "@/middleware/security-headers";
import { productionConfig } from "@/lib/production-config";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const hostname = req.headers.get('host');
    const pathname = req.nextUrl.pathname;
    
    // Apply rate limiting to API routes
    if (pathname.startsWith('/api/')) {
      const rateLimitResponse = applyRateLimit(req);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
    }
    
    // Extract tenant from subdomain or custom domain
    let tenantId: string | null = null;
    if (hostname) {
      // Check for custom domain
      if (hostname !== 'localhost:3000' && hostname !== '127.0.0.1:3000') {
        // In production, this would query the database for custom domains
        // For now, we'll use the token tenantId
        tenantId = token?.tenantId || null;
      }
    }
    
    // Use tenant from token if no custom domain
    if (!tenantId && token?.tenantId) {
      tenantId = token.tenantId;
    }
    
    if (tenantId && token?.tenantId !== tenantId) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    
    // Add tenant context to request headers
    if (tenantId) {
      req.headers.set('x-tenant-id', tenantId);
    }
    
    // Add security headers
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/guards/:path*",
    "/reports/:path*",
    // Exclude API routes that don't need authentication
    "/((?!api/auth|auth/signin|auth/error|_next/static|_next/image|favicon.ico).*)",
  ],
};