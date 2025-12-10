import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo tenant
  const demoTenant = await prisma.tenant.create({
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

  console.log('✅ Created tenant settings');

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

  console.log('✅ Created subscription');

  // Create admin user
  const hashedPassword = await bcrypt.hash('password123', 12);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@security.com',
      name: 'Demo Administrator',
      password: hashedPassword,
      role: 'admin',
      tenantId: demoTenant.id,
    },
  });

  console.log('✅ Created admin user:', adminUser.email);

  // Create field officer
  const officerPassword = await bcrypt.hash('password123', 12);
  const officerUser = await prisma.user.create({
    data: {
      email: 'officer@security.com',
      name: 'Demo Field Officer',
      password: officerPassword,
      role: 'field_officer',
      tenantId: demoTenant.id,
    },
  });

  console.log('✅ Created field officer:', officerUser.email);

  // Create guard user
  const guardPassword = await bcrypt.hash('password123', 12);
  const guardUser = await prisma.user.create({
    data: {
      email: 'guard@security.com',
      name: 'Demo Guard',
      password: guardPassword,
      role: 'guard',
      tenantId: demoTenant.id,
    },
  });

  console.log('✅ Created guard user:', guardUser.email);

  // Create demo guards
  const demoGuards = await Promise.all([
    prisma.guard.create({
      data: {
        name: 'Demo Guard',
        phone: '+91 98765 43210',
        email: 'guard@security.com',
        address: '123 Main Street, Delhi',
        status: 'active',
        salary: 25000,
        hourlyRate: 150,
        userId: guardUser.id,
      },
    }),
    prisma.guard.create({
      data: {
        name: 'Rajesh Kumar',
        phone: '+91 87654 32109',
        email: 'rajesh@demo.com',
        address: '456 Park Avenue, Mumbai',
        status: 'active',
        salary: 28000,
        hourlyRate: 175,
        userId: officerUser.id,
      },
    }),
    prisma.guard.create({
      data: {
        name: 'Suresh Patel',
        phone: '+91 76543 21098',
        email: 'suresh@demo.com',
        address: '789 Market Road, Bangalore',
        status: 'on_leave',
        salary: 22000,
        hourlyRate: 140,
        userId: officerUser.id,
      },
    }),
  ]);

  console.log('✅ Created demo guards');

  // Create demo posts
  const demoPosts = await Promise.all([
    prisma.post.create({
      data: {
        name: 'Main Gate',
        address: 'Main Entrance, Building A',
        latitude: 28.6139,
        longitude: 77.2090,
        description: 'Main security checkpoint',
        userId: officerUser.id,
      },
    }),
    prisma.post.create({
      data: {
        name: 'Parking Area',
        address: 'Underground Parking, Level B1',
        latitude: 28.6140,
        longitude: 77.2091,
        description: 'Vehicle parking security',
        userId: officerUser.id,
      },
    }),
    prisma.post.create({
      data: {
        name: 'Building A',
        address: 'Office Tower A, All Floors',
        latitude: 28.6141,
        longitude: 77.2092,
        description: 'Main office building security',
        userId: officerUser.id,
      },
    }),
  ]);

  console.log('✅ Created demo posts');

  // Create demo shifts
  const demoShifts = await Promise.all([
    prisma.shift.create({
      data: {
        name: 'Day Shift',
        startTime: new Date('2024-01-01T08:00:00'),
        endTime: new Date('2024-01-01T16:00:00'),
        status: 'scheduled',
        userId: officerUser.id,
        guardId: demoGuards[1].id, // Rajesh Kumar
        postId: demoPosts[0].id,
      },
    }),
    prisma.shift.create({
      data: {
        name: 'Night Shift',
        startTime: new Date('2024-01-01T22:00:00'),
        endTime: new Date('2024-01-02T06:00:00'),
        status: 'scheduled',
        userId: officerUser.id,
        guardId: demoGuards[2].id, // Suresh Patel
        postId: demoPosts[1].id,
      },
    }),
  ]);

  console.log('✅ Created demo shifts');

  // Create demo locations
  await prisma.location.createMany({
    data: [
      {
        latitude: 28.6139,
        longitude: 77.2090,
        timestamp: new Date(),
        speed: 0,
        direction: 0,
        userId: guardUser.id,
        guardId: demoGuards[0].id, // Demo Guard
      },
      {
        latitude: 28.6140,
        longitude: 77.2091,
        timestamp: new Date(),
        speed: 0,
        direction: 90,
        userId: officerUser.id,
        guardId: demoGuards[1].id, // Rajesh Kumar
      },
    ],
  });

  console.log('✅ Created demo locations');

  // Create demo alerts
  await prisma.alert.createMany({
    data: [
      {
        type: 'geofence_breach',
        message: 'Guard Demo Guard has left the designated area',
        severity: 'high',
        status: 'active',
        userId: guardUser.id,
        guardId: demoGuards[0].id, // Demo Guard
      },
      {
        type: 'late_arrival',
        message: 'Guard Rajesh Kumar arrived 15 minutes late',
        severity: 'medium',
        status: 'active',
        userId: officerUser.id,
        guardId: demoGuards[1].id, // Rajesh Kumar
      },
    ],
  });

  console.log('✅ Created demo alerts');

  // Create demo notifications
  await prisma.notification.createMany({
    data: [
      {
        title: 'System Update',
        message: 'New security features have been added to the platform',
        type: 'system',
        priority: 'medium',
        userId: adminUser.id,
      },
      {
        title: 'Shift Reminder',
        message: 'Day shift starts in 1 hour',
        type: 'reminder',
        priority: 'high',
        guardId: demoGuards[1].id, // Rajesh Kumar
      },
      {
        title: 'Welcome to Guard Mobile App',
        message: 'Your guard account has been activated',
        type: 'system',
        priority: 'medium',
        guardId: demoGuards[0].id, // Demo Guard
      },
    ],
  });

  console.log('✅ Created demo notifications');

  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('Demo Credentials:');
  console.log('Admin: admin@security.com / password123');
  console.log('Field Officer: officer@security.com / password123');
  console.log('Guard: guard@security.com / password123');
  console.log('');
  console.log('Access the app at: http://localhost:3000');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });