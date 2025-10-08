import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAuth() {
  try {
    console.log('🔐 Testing authentication...');
    
    const testUser = await prisma.user.findFirst({
      where: {
        email: 'admin@security.com'
      },
      include: {
        tenant: true
      }
    });

    if (!testUser) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', testUser.email);
    console.log('  Password hash length:', testUser.password?.length || 0);
    
    // Test password comparison
    const testPassword = 'password123';
    const isValidPassword = await bcrypt.compare(testPassword, testUser.password || '');
    
    console.log('  Password test result:', isValidPassword ? '✅ Valid' : '❌ Invalid');
    
    // Test subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        tenantId: testUser.tenantId,
        status: 'active'
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('  Subscription:', subscription ? '✅ Found' : '❌ Not found');
    if (subscription) {
      console.log('    Plan:', subscription.plan);
      console.log('    Status:', subscription.status);
    }
    
    console.log('  Tenant status:', testUser.tenant.status);
    
    // Test the exact same logic as in auth config
    if (!testUser || !testUser.password) {
      console.log('❌ No user or password');
      return;
    }

    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return;
    }

    if (testUser.tenant.status !== 'active') {
      console.log('❌ Tenant not active');
      return;
    }

    if (!subscription) {
      console.log('❌ No active subscription');
      return;
    }

    console.log('🎉 Authentication would succeed!');

  } catch (error) {
    console.error('❌ Error testing auth:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();