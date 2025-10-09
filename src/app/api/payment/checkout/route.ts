import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { db } from '@/lib/db';
import PaymentService, { SUBSCRIPTION_PLANS } from '@/lib/payment/stripe';
import { logger } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, successUrl, cancelUrl } = body;

    if (!planId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate plan
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const tenantId = session.user.tenantId;

    // Get tenant details
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    // Get or create Stripe customer
    let customerId = tenant.stripeCustomerId;
    
    if (!customerId) {
      const customer = await PaymentService.createCustomer(
        session.user.email || '',
        tenant.name,
        tenantId
      );
      customerId = customer.id;

      // Update tenant with Stripe customer ID
      await db.tenant.update({
        where: { id: tenantId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create or get Stripe price for the plan
    let priceId: string;
    
    // In a real implementation, you would store price IDs in your database
    // For now, we'll create a price each time (in production, cache these)
    try {
      const price = await PaymentService.createPrice(plan);
      priceId = price.id;
    } catch (error) {
      logger.error('Failed to create Stripe price', { error, planId });
      return NextResponse.json(
        { error: 'Failed to create subscription price' },
        { status: 500 }
      );
    }

    // Create checkout session
    const checkoutSession = await PaymentService.createCheckoutSession(
      customerId,
      priceId,
      tenantId,
      successUrl,
      cancelUrl
    );

    logger.info('Checkout session created', { 
      sessionId: checkoutSession.id, 
      tenantId, 
      planId 
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      success: true
    });

  } catch (error) {
    logger.error('Failed to create checkout session', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}