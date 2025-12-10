import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('🔍 Checking database users...');
    
    const users = await prisma.user.findMany({
      include: {
        tenant: true
      }
    });

    console.log('Found users:');
    users.forEach(user => {
      console.log(`- ${user.email} (Role: ${user.role}, Tenant: ${user.tenant.name})`);
    });

    console.log('');
    console.log('Testing specific demo users...');
    
    const adminUser = await prisma.user.findFirst({
      where: {
        email: 'admin@security.com'
      },
      include: {
        tenant: true
      }
    });

    console.log('Admin user:', adminUser ? 'Found' : 'Not found');
    if (adminUser) {
      console.log('  Email:', adminUser.email);
      console.log('  Role:', adminUser.role);
      console.log('  Tenant:', adminUser.tenant.name);
      console.log('  Tenant Status:', adminUser.tenant.status);
      console.log('  Has Password:', !!adminUser.password);
    }

    const guardUser = await prisma.user.findFirst({
      where: {
        email: 'guard@security.com'
      },
      include: {
        tenant: true
      }
    });

    console.log('Guard user:', guardUser ? 'Found' : 'Not found');
    if (guardUser) {
      console.log('  Email:', guardUser.email);
      console.log('  Role:', guardUser.role);
      console.log('  Tenant:', guardUser.tenant.name);
      console.log('  Tenant Status:', guardUser.tenant.status);
      console.log('  Has Password:', !!guardUser.password);
    }

    const officerUser = await prisma.user.findFirst({
      where: {
        email: 'officer@security.com'
      },
      include: {
        tenant: true
      }
    });

    console.log('Field Officer user:', officerUser ? 'Found' : 'Not found');
    if (officerUser) {
      console.log('  Email:', officerUser.email);
      console.log('  Role:', officerUser.role);
      console.log('  Tenant:', officerUser.tenant.name);
      console.log('  Tenant Status:', officerUser.tenant.status);
      console.log('  Has Password:', !!officerUser.password);
    }

    // Check subscriptions
    console.log('');
    console.log('Checking subscriptions...');
    
    const subscriptions = await prisma.subscription.findMany({
      include: {
        tenant: true
      }
    });

    subscriptions.forEach(sub => {
      console.log(`- ${sub.tenant.name}: ${sub.plan} (${sub.status})`);
    });

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();