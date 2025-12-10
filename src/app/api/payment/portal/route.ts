import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';
import PaymentService from '@/lib/payment/stripe';
import { logger } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { returnUrl } = body;

    if (!returnUrl) {
      return NextResponse.json(
        { error: 'Missing return URL' },
        { status: 400 }
      );
    }

    const tenantId = session.user.tenantId;

    // Get tenant details
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant || !tenant.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 404 }
      );
    }

    // Create customer portal session
    const portalSession = await PaymentService.createPortalSession(
      tenant.stripeCustomerId,
      returnUrl
    );

    logger.info('Customer portal session created', { 
      sessionId: portalSession.id, 
      tenantId 
    });

    return NextResponse.json({
      url: portalSession.url,
      success: true
    });

  } catch (error) {
    logger.error('Failed to create portal session', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}