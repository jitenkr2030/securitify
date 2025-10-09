import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createDemoUsers() {
  console.log('🔧 Creating demo users with correct credentials...');

  try {
    // Find the existing demo tenant
    const demoTenant = await prisma.tenant.findFirst({
      where: {
        subdomain: 'demo'
      }
    });

    if (!demoTenant) {
      console.log('❌ Demo tenant not found. Please run the main seed first.');
      return;
    }

    console.log('✅ Found demo tenant:', demoTenant.name);

    // Hash the common password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Create admin user with correct email
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

    console.log('✅ Created/updated admin user:', adminUser.email);

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

    console.log('✅ Created/updated guard user:', guardUser.email);

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

    console.log('✅ Created/updated field officer user:', officerUser.email);

    // Create a guard profile for the guard user
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

    console.log('✅ Created guard profile for guard user');

    console.log('');
    console.log('🎉 Demo users created successfully!');
    console.log('');
    console.log('Demo Credentials:');
    console.log('Admin: admin@security.com / password123');
    console.log('Guard: guard@security.com / password123');
    console.log('Field Officer: officer@security.com / password123');
    console.log('');

  } catch (error) {
    console.error('❌ Error creating demo users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUsers();