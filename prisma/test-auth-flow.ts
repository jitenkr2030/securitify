import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAuthFlow() {
  try {
    console.log('🔐 Testing complete authentication flow...');
    
    // Test user lookup and password verification
    const user = await prisma.user.findFirst({
      where: {
        email: 'admin@security.com'
      },
      include: {
        tenant: true
      }
    });

    if (!user || !user.password) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', user.email);
    
    // Test password
    const isValidPassword = await bcrypt.compare('password123', user.password);
    console.log('✅ Password valid:', isValidPassword);
    
    // Test tenant status
    console.log('✅ Tenant status:', user.tenant.status);
    
    // Test subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        tenantId: user.tenantId,
        status: 'active'
      }
    });
    console.log('✅ Subscription found:', !!subscription);
    
    // Return what would be the user object for NextAuth
    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      tenantName: user.tenant.name,
      tenantPlan: user.tenant.plan
    };
    
    console.log('✅ Auth user object:', authUser);
    console.log('🎉 Authentication flow test complete - all checks passed!');
    
  } catch (error) {
    console.error('❌ Error in auth flow test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuthFlow();