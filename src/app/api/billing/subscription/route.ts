import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';
import { logger } from '@/lib/monitoring';

export async function GET(request: NextRequest) {
  let session: any = null;
  
  try {
    session = await getServerSession(authOptions);
    
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    
    // For now, return mock subscription data
    // In a real implementation, you would fetch from Stripe
    const mockSubscription = {
      id: 'sub_123456789',
      status: 'active',
      plan: 'professional',
      amount: 99,
      currency: 'usd',
      currentPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false
    };

    logger.info('Subscription retrieved successfully', { tenantId });

    return NextResponse.json(mockSubscription);

  } catch (error) {
    logger.error('Failed to get subscription', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      tenantId: session?.user?.tenantId || "unknown" 
    });

    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    );
  }
}
