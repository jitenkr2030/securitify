import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log('🔧 Creating demo users...');

    // Find or create demo tenant
    let demoTenant = await prisma.tenant.findFirst({
      where: {
        subdomain: 'demo'
      }
    });

    if (!demoTenant) {
      demoTenant = await prisma.tenant.create({
        data: {
          name: 'Demo Security Company',
          subdomain: 'demo',
          plan: 'professional',
          status: 'active',
        },
      });
      console.log('✅ Created demo tenant:', demoTenant.name);

      // Create tenant settings
      await prisma.tenantSetting.createMany({
        data: [
          { tenantId: demoTenant.id, key: 'timezone', value: 'UTC' },
          { tenantId: demoTenant.id, key: 'currency', value: 'USD' },
          { tenantId: demoTenant.id, key: 'language', value: 'en' },
          { tenantId: demoTenant.id, key: 'logo_url', value: '' },
          { tenantId: demoTenant.id, key: 'primary_color', value: '#3b82f6' },
          { tenantId: demoTenant.id, key: 'secondary_color', value: '#64748b' },
        ],
      });

      // Create subscription
      await prisma.subscription.create({
        data: {
          tenantId: demoTenant.id,
          plan: 'professional',
          status: 'active',
          startDate: new Date(),
          amount: 99,
        },
      });
    }

    // Hash the common password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: {
        email_tenantId: {
          email: 'admin@security.com',
          tenantId: demoTenant.id
        }
      },
      update: {},
      create: {
        email: 'admin@security.com',
        name: 'Demo Administrator',
        password: hashedPassword,
        role: 'admin',
        tenantId: demoTenant.id,
      },
    });

    // Create guard user
    const guardUser = await prisma.user.upsert({
      where: {
        email_tenantId: {
          email: 'guard@security.com',
          tenantId: demoTenant.id
        }
      },
      update: {},
      create: {
        email: 'guard@security.com',
        name: 'Demo Guard',
        password: hashedPassword,
        role: 'guard',
        tenantId: demoTenant.id,
      },
    });

    // Create field officer user
    const officerUser = await prisma.user.upsert({
      where: {
        email_tenantId: {
          email: 'officer@security.com',
          tenantId: demoTenant.id
        }
      },
      update: {},
      create: {
        email: 'officer@security.com',
        name: 'Demo Field Officer',
        password: hashedPassword,
        role: 'field_officer',
        tenantId: demoTenant.id,
      },
    });

    // Create guard profile for the guard user
    await prisma.guard.upsert({
      where: {
        phone_userId: {
          phone: '+91 12345 67890',
          userId: guardUser.id
        }
      },
      update: {},
      create: {
        name: 'Demo Security Guard',
        phone: '+91 12345 67890',
        email: 'guard@security.com',
        address: '123 Security Street, Demo City',
        status: 'active',
        salary: 25000,
        hourlyRate: 150,
        userId: guardUser.id,
      },
    });

    console.log('✅ Demo users created successfully');

    return NextResponse.json({
      success: true,
      message: 'Demo users created successfully',
      users: [
        { email: adminUser.email, role: adminUser.role },
        { email: guardUser.email, role: guardUser.role },
        { email: officerUser.email, role: officerUser.role }
      ]
    });

  } catch (error) {
    console.error('❌ Error creating demo users:', error);
    return NextResponse.json(
      { error: 'Failed to create demo users' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}