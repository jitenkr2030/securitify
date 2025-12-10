import { NextRequest, NextResponse } from 'next/server';
import { TenantService } from '@/lib/tenant';
import { emailService } from '@/lib/email/service';
import { z } from 'zod';
import { initializeDatabase } from '@/lib/db';

const createTenantSchema = z.object({
  name: z.string().min(1, 'Tenant name is required'),
  domain: z.string().optional(),
  subdomain: z.string().optional(),
  plan: z.enum(['free', 'basic', 'professional', 'enterprise']).optional(),
  adminUser: z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(1, 'Admin name is required'),
    password: z.string().min(8, 'Password must be at least 8 characters')
  })
});

export async function POST(request: NextRequest) {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    const body = await request.json();
    const validatedData = createTenantSchema.parse(body);

    // Check if domain or subdomain already exists
    if (validatedData.domain) {
      const existingDomain = await TenantService.getTenantByDomain(validatedData.domain);
      if (existingDomain) {
        return NextResponse.json(
          { error: 'Domain already exists' },
          { status: 400 }
        );
      }
    }

    if (validatedData.subdomain) {
      const existingSubdomain = await TenantService.getTenantByDomain(validatedData.subdomain);
      if (existingSubdomain) {
        return NextResponse.json(
          { error: 'Subdomain already exists' },
          { status: 400 }
        );
      }
    }

    // Create tenant
    const tenant = await TenantService.createTenant({
      name: validatedData.name,
      domain: validatedData.domain,
      subdomain: validatedData.subdomain,
      plan: validatedData.plan || 'basic'
    });

    // Create admin user
    const adminUser = await TenantService.createTenantAdmin(tenant.id, validatedData.adminUser);

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(
        tenant.name,
        adminUser.email,
        adminUser.name
      );
    } catch (emailError) {
      // Log email error but don't fail the registration
      console.error('Failed to send welcome email:', emailError);
    }

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        subdomain: tenant.subdomain,
        plan: tenant.plan,
        status: tenant.status
      },
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Tenant creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    // Handle database connection errors specifically
    if (error instanceof Error && error.message.includes('DATABASE_URL')) {
      return NextResponse.json(
        { error: 'Database configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create tenant' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (domain) {
      const tenant = await TenantService.getTenantByDomain(domain);
      if (!tenant) {
        return NextResponse.json(
          { error: 'Tenant not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain,
        subdomain: tenant.subdomain,
        plan: tenant.plan,
        status: tenant.status
      });
    }

    return NextResponse.json(
      { error: 'Domain parameter is required' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Tenant lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to lookup tenant' },
      { status: 500 }
    );
  }
}