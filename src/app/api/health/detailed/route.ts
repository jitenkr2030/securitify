import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { productionConfig } from '@/lib/production-config';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: productionConfig.app.env,
      version: productionConfig.app.version,
      checks: {} as Record<string, any>
    };

    // Database check
    try {
      const demoTenant = await prisma.tenant.findFirst({
        where: { subdomain: 'demo' }
      });
      
      if (demoTenant) {
        const userCount = await prisma.user.count({
          where: { tenantId: demoTenant.id }
        });
        
        health.checks.database = {
          status: 'healthy',
          demoTenant: {
            name: demoTenant.name,
            status: demoTenant.status,
            userCount
          }
        };
      } else {
        health.checks.database = {
          status: 'warning',
          message: 'Demo tenant not found'
        };
      }
    } catch (error) {
      health.checks.database = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      health.status = 'degraded';
    }

    // Authentication check
    try {
      const demoUser = await prisma.user.findFirst({
        where: {
          email: 'admin@security.com',
          tenant: {
            subdomain: 'demo'
          }
        }
      });
      
      if (demoUser && demoUser.password) {
        health.checks.authentication = {
          status: 'healthy',
          demoUser: {
            email: demoUser.email,
            role: demoUser.role,
            hasPassword: !!demoUser.password
          }
        };
      } else {
        health.checks.authentication = {
          status: 'warning',
          message: 'Demo admin user not found or missing password'
        };
      }
    } catch (error) {
      health.checks.authentication = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      health.status = 'degraded';
    }

    // Configuration check
    const requiredEnvVars = [
      'NEXTAUTH_SECRET',
      'NEXT_PUBLIC_APP_URL',
      'DATABASE_URL'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length === 0) {
      health.checks.configuration = {
        status: 'healthy',
        environment: productionConfig.app.env,
        url: productionConfig.app.url
      };
    } else {
      health.checks.configuration = {
        status: 'warning',
        missingEnvVars,
        message: 'Missing required environment variables'
      };
      health.status = 'degraded';
    }

    // Rate limiting check
    try {
      health.checks.rateLimiting = {
        status: 'healthy',
        config: {
          windowMs: productionConfig.security.rateLimit.windowMs,
          max: productionConfig.security.rateLimit.max,
          productionReady: process.env.NODE_ENV !== 'production'
        },
        warning: process.env.NODE_ENV === 'production' 
          ? 'Using in-memory rate limiting in production. Consider Redis for production deployment.'
          : undefined
      };
    } catch (error) {
      health.checks.rateLimiting = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      health.status = 'degraded';
    }

    // Security headers check
    try {
      health.checks.security = {
        status: 'healthy',
        csp: productionConfig.security.headers.csp.substring(0, 50) + '...',
        permissionsPolicy: productionConfig.security.headers.permissionsPolicy,
        corsOrigins: productionConfig.security.cors.origins
      };
    } catch (error) {
      health.checks.security = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      health.status = 'degraded';
    }

    // Set appropriate HTTP status
    const statusCode = health.status === 'healthy' ? 200 : 
                       health.status === 'degraded' ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });

  } catch (error) {
    console.error('❌ Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    );
  } finally {
    await prisma.$disconnect();
  }
}