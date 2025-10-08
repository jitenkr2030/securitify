import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import PaymentService from '@/lib/payment/stripe';
import { emailService } from '@/lib/email/service';
import { db } from '@/lib/db';
import { logger } from '@/lib/monitoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      logger.error('Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event;
    try {
      event = PaymentService.verifyWebhookSignature(body, signature);
    } catch (error) {
      logger.error('Invalid webhook signature', { error: error instanceof Error ? error.message : 'Unknown error' });
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the webhook event
    await PaymentService.handleWebhookEvent(event);

    // Send email notifications for specific events
    await handleEmailNotifications(event);

    logger.info('Webhook processed successfully', { type: event.type, id: event.id });

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Webhook processing failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleEmailNotifications(event: any) {
  try {
    const tenantId = event.data.object.metadata?.tenantId;
    
    if (!tenantId) {
      logger.warn('No tenantId found in webhook event', { type: event.type, id: event.id });
      return;
    }

    // Get tenant details
    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
      include: {
        users: {
          where: { role: 'admin' },
          take: 1
        }
      }
    });

    if (!tenant || !tenant.users[0]) {
      logger.warn('Tenant or admin user not found', { tenantId, type: event.type });
      return;
    }

    const adminUser = tenant.users[0];

    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreatedEmail(event, tenant, adminUser);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceededEmail(event, tenant, adminUser);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailedEmail(event, tenant, adminUser);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelledEmail(event, tenant, adminUser);
        break;
    }
  } catch (error) {
    logger.error('Failed to handle email notifications', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      type: event.type,
      id: event.id 
    });
  }
}

async function handleSubscriptionCreatedEmail(event: any, tenant: any, adminUser: any) {
  try {
    const subscription = event.data.object;
    const planName = getPlanNameFromPrice(subscription.items.data[0]?.price?.id);
    const amount = subscription.items.data[0]?.price?.unit_amount / 100;
    const nextBillingDate = new Date(subscription.current_period_end * 1000);

    await emailService.sendSubscriptionConfirmation(
      tenant.name,
      adminUser.email,
      planName,
      amount,
      nextBillingDate
    );

    logger.info('Subscription confirmation email sent', { 
      tenantId: tenant.id, 
      planName, 
      amount 
    });
  } catch (error) {
    logger.error('Failed to send subscription confirmation email', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      tenantId: tenant.id 
    });
  }
}

async function handlePaymentSucceededEmail(event: any, tenant: any, adminUser: any) {
  try {
    const invoice = event.data.object;
    const amount = invoice.amount_paid / 100;
    const subscriptionId = invoice.subscription;
    
    if (subscriptionId) {
      // This is a subscription payment
      const planName = await getPlanNameFromSubscription(subscriptionId);
      const nextBillingDate = new Date(invoice.period_end * 1000);

      await emailService.sendSubscriptionConfirmation(
        tenant.name,
        adminUser.email,
        planName,
        amount,
        nextBillingDate
      );
    }

    logger.info('Payment succeeded email sent', { 
      tenantId: tenant.id, 
      amount 
    });
  } catch (error) {
    logger.error('Failed to send payment succeeded email', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      tenantId: tenant.id 
    });
  }
}

async function handlePaymentFailedEmail(event: any, tenant: any, adminUser: any) {
  try {
    const invoice = event.data.object;
    const amount = invoice.amount_due / 100;
    const nextPaymentAttempt = invoice.next_payment_attempt 
      ? new Date(invoice.next_payment_attempt * 1000) 
      : undefined;

    await emailService.sendPaymentFailedEmail(
      tenant.name,
      adminUser.email,
      amount,
      nextPaymentAttempt
    );

    logger.info('Payment failed email sent', { 
      tenantId: tenant.id, 
      amount 
    });
  } catch (error) {
    logger.error('Failed to send payment failed email', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      tenantId: tenant.id 
    });
  }
}

async function handleSubscriptionCancelledEmail(event: any, tenant: any, adminUser: any) {
  try {
    // Send a simple notification about subscription cancellation
    await emailService.sendEmail({
      to: adminUser.email,
      subject: `Subscription Cancelled - ${tenant.name}`,
      html: `
        <h2>Subscription Cancelled</h2>
        <p>Hi ${adminUser.name || 'Admin'},</p>
        <p>Your subscription for <strong>${tenant.name}</strong> has been cancelled.</p>
        <p>If this was a mistake or you'd like to reactivate your subscription, please contact our support team.</p>
        <p>Best regards,<br>The ${process.env.NEXT_PUBLIC_APP_NAME || 'Securitify'} Team</p>
      `,
      text: `Subscription Cancelled\n\nHi ${adminUser.name || 'Admin'},\n\nYour subscription for ${tenant.name} has been cancelled.\n\nIf this was a mistake or you'd like to reactivate your subscription, please contact our support team.\n\nBest regards,\nThe ${process.env.NEXT_PUBLIC_APP_NAME || 'Securitify'} Team`
    });

    logger.info('Subscription cancelled email sent', { 
      tenantId: tenant.id 
    });
  } catch (error) {
    logger.error('Failed to send subscription cancelled email', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      tenantId: tenant.id 
    });
  }
}

// Helper function to get plan name from price ID
function getPlanNameFromPrice(priceId: string): string {
  // In a real implementation, you would store price IDs in your database
  // For now, we'll use a simple mapping based on price amount
  if (!priceId) return 'Unknown';
  
  // This is a simplified approach - in production, you should store price IDs
  // and map them to plan names in your database
  return 'Professional'; // Default fallback
}

// Helper function to get plan name from subscription ID
async function getPlanNameFromSubscription(subscriptionId: string): Promise<string> {
  try {
    // In a real implementation, you would query your database
    // to get the plan name associated with the subscription
    return 'Professional'; // Default fallback
  } catch (error) {
    logger.error('Failed to get plan name from subscription', { subscriptionId });
    return 'Unknown';
  }
}