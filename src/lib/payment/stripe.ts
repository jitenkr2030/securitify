import Stripe from 'stripe';
import { productionConfig } from '@/lib/production-config';
import { db } from '@/lib/db';
import { logger } from '@/lib/monitoring';

// Lazy initialize Stripe
let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    if (!productionConfig.payment.stripe.secretKey) {
      throw new Error('Stripe secret key is not configured');
    }
    stripe = new Stripe(productionConfig.payment.stripe.secretKey, {
      apiVersion: '2025-08-27.basil',
      typescript: true,
    });
  }
  return stripe;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  metadata: {
    guardLimit: number;
    postLimit: number;
    apiCallsLimit: number;
    features: string[];
  };
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out the platform',
    price: 0,
    currency: 'usd',
    interval: 'month',
    features: [
      'Up to 3 guards',
      'Basic GPS tracking',
      'Email support',
      'Mobile app access',
      'Basic reporting'
    ],
    metadata: {
      guardLimit: 3,
      postLimit: 1,
      apiCallsLimit: 100,
      features: ['basic_tracking', 'email_support', 'mobile_app', 'basic_reports']
    }
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for small security teams',
    price: 49,
    currency: 'usd',
    interval: 'month',
    features: [
      'Up to 10 guards',
      'Basic GPS tracking',
      'Email support',
      'Mobile app access',
      'Basic reporting'
    ],
    metadata: {
      guardLimit: 10,
      postLimit: 5,
      apiCallsLimit: 1000,
      features: ['basic_tracking', 'email_support', 'mobile_app', 'basic_reports']
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Best for growing security companies',
    price: 99,
    currency: 'usd',
    interval: 'month',
    features: [
      'Up to 50 guards',
      'Advanced tracking',
      'Priority support',
      'API access',
      'Advanced analytics',
      'Custom reports',
      'White-label options'
    ],
    metadata: {
      guardLimit: 50,
      postLimit: 20,
      apiCallsLimit: 5000,
      features: ['advanced_tracking', 'priority_support', 'api_access', 'advanced_analytics', 'custom_reports', 'white_label']
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large security operations',
    price: 299,
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited guards',
      'White-label platform',
      'Dedicated support',
      'Custom integrations',
      'Advanced features',
      'Priority SLA',
      'Custom development',
      'Training included'
    ],
    metadata: {
      guardLimit: -1, // Unlimited
      postLimit: -1, // Unlimited
      apiCallsLimit: -1, // Unlimited
      features: ['unlimited_guards', 'white_label', 'dedicated_support', 'custom_integrations', 'advanced_features', 'priority_sla', 'custom_development', 'training']
    }
  }
];

export class PaymentService {
  /**
   * Create or retrieve Stripe customer
   */
  static async createCustomer(email: string, name: string, tenantId: string): Promise<Stripe.Customer> {
    try {
      logger.info('Creating Stripe customer', { email, tenantId });

      const customer = await getStripe().customers.create({
        email,
        name,
        metadata: {
          tenantId,
        },
      });

      logger.info('Stripe customer created successfully', { customerId: customer.id, tenantId });
      return customer;
    } catch (error) {
      logger.error('Failed to create Stripe customer', { error: error instanceof Error ? error.message : 'Unknown error', email, tenantId });
      throw new Error('Failed to create customer');
    }
  }

  /**
   * Create Stripe checkout session for subscription
   */
  static async createCheckoutSession(
    customerId: string,
    priceId: string,
    tenantId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<Stripe.Checkout.Session> {
    try {
      logger.info('Creating checkout session', { customerId, priceId, tenantId });

      const session = await getStripe().checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          tenantId,
        },
        subscription_data: {
          metadata: {
            tenantId,
          },
        },
      });

      logger.info('Checkout session created successfully', { sessionId: session.id, tenantId });
      return session;
    } catch (error) {
      logger.error('Failed to create checkout session', { error: error instanceof Error ? error.message : 'Unknown error', customerId, tenantId });
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Create Stripe price for subscription plan
   */
  static async createPrice(plan: SubscriptionPlan): Promise<Stripe.Price> {
    try {
      logger.info('Creating Stripe price', { planId: plan.id });

      const price = await getStripe().prices.create({
        unit_amount: plan.price * 100, // Convert to cents
        currency: plan.currency,
        recurring: {
          interval: plan.interval,
        },
        product_data: {
          name: plan.name,
          metadata: {
            planId: plan.id,
            guardLimit: plan.metadata.guardLimit,
            postLimit: plan.metadata.postLimit,
            apiCallsLimit: plan.metadata.apiCallsLimit,
            features: plan.metadata.features.join(','),
          },
        },
      });

      logger.info('Stripe price created successfully', { priceId: price.id, planId: plan.id });
      return price;
    } catch (error) {
      logger.error('Failed to create Stripe price', { error: error instanceof Error ? error.message : 'Unknown error', planId: plan.id });
      throw new Error('Failed to create price');
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string, cancelImmediately = false): Promise<Stripe.Subscription> {
    try {
      logger.info('Cancelling subscription', { subscriptionId, cancelImmediately });

      const subscription = await getStripe().subscriptions.update(subscriptionId, {
        cancel_at_period_end: !cancelImmediately,
      });

      if (cancelImmediately) {
        await getStripe().subscriptions.cancel(subscriptionId);
      }

      logger.info('Subscription cancelled successfully', { subscriptionId });
      return subscription;
    } catch (error) {
      logger.error('Failed to cancel subscription', { error: error instanceof Error ? error.message : 'Unknown error', subscriptionId });
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Get subscription details
   */
  static async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await getStripe().subscriptions.retrieve(subscriptionId, {
        expand: ['latest_invoice.payment_intent'],
      });

      return subscription;
    } catch (error) {
      logger.error('Failed to retrieve subscription', { error: error instanceof Error ? error.message : 'Unknown error', subscriptionId });
      throw new Error('Failed to retrieve subscription');
    }
  }

  /**
   * Handle Stripe webhook events
   */
  static async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    try {
      logger.info('Processing Stripe webhook event', { type: event.type, id: event.id });

      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        default:
          logger.warn('Unhandled Stripe webhook event', { type: event.type });
      }

      logger.info('Stripe webhook event processed successfully', { type: event.type, id: event.id });
    } catch (error) {
      logger.error('Failed to handle Stripe webhook event', { error: error instanceof Error ? error.message : 'Unknown error', type: event.type, id: event.id });
      throw error;
    }
  }

  /**
   * Handle subscription created event
   */
  private static async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    const tenantId = subscription.metadata?.tenantId;
    if (!tenantId) {
      logger.error('Subscription created without tenantId', { subscriptionId: subscription.id });
      return;
    }

    logger.info('Handling subscription created', { subscriptionId: subscription.id, tenantId });
    
    try {
      // Update tenant with Stripe subscription ID
      await db.tenant.update({
        where: { id: tenantId },
        data: { 
          stripeSubscriptionId: subscription.id,
          plan: subscription.metadata?.plan || 'basic'
        }
      });

      // Create subscription record
      const price = subscription.items.data[0]?.price;
      const subscriptionData = subscription as any;
      await db.subscription.create({
        data: {
          tenantId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: price?.id,
          plan: subscription.metadata?.plan || 'basic',
          status: subscription.status,
          startDate: subscriptionData.current_period_start ? new Date(subscriptionData.current_period_start * 1000) : new Date(),
          endDate: subscriptionData.cancel_at ? new Date(subscriptionData.cancel_at * 1000) : null,
          currentPeriodStart: subscriptionData.current_period_start ? new Date(subscriptionData.current_period_start * 1000) : new Date(),
          currentPeriodEnd: subscriptionData.current_period_end ? new Date(subscriptionData.current_period_end * 1000) : new Date(),
          amount: (price?.unit_amount || 0) / 100, // Convert from cents
          currency: price?.currency || 'usd',
          interval: price?.recurring?.interval || 'month',
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          trialEnd: subscriptionData.trial_end ? new Date(subscriptionData.trial_end * 1000) : null,
          metadata: JSON.stringify({
            customer_id: subscription.customer,
            plan_id: subscription.metadata?.plan,
            ...subscription.metadata
          })
        }
      });

      logger.info('Subscription created successfully in database', { subscriptionId: subscription.id, tenantId });
    } catch (error) {
      logger.error('Failed to create subscription in database', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        subscriptionId: subscription.id,
        tenantId 
      });
      throw error;
    }
  }

  /**
   * Handle subscription updated event
   */
  private static async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    const tenantId = subscription.metadata?.tenantId;
    if (!tenantId) {
      logger.error('Subscription updated without tenantId', { subscriptionId: subscription.id });
      return;
    }

    logger.info('Handling subscription updated', { subscriptionId: subscription.id, tenantId, status: subscription.status });
    
    try {
      // Update tenant plan if changed
      if (subscription.metadata?.plan) {
        await db.tenant.update({
          where: { id: tenantId },
          data: { plan: subscription.metadata.plan }
        });
      }

      // Update subscription record
      const price = subscription.items.data[0]?.price;
      const subscriptionData = subscription as any;
      await db.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: subscription.status,
          endDate: subscriptionData.cancel_at ? new Date(subscriptionData.cancel_at * 1000) : null,
          currentPeriodStart: subscriptionData.current_period_start ? new Date(subscriptionData.current_period_start * 1000) : new Date(),
          currentPeriodEnd: subscriptionData.current_period_end ? new Date(subscriptionData.current_period_end * 1000) : new Date(),
          amount: (price?.unit_amount || 0) / 100,
          currency: price?.currency || 'usd',
          interval: price?.recurring?.interval || 'month',
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          trialEnd: subscriptionData.trial_end ? new Date(subscriptionData.trial_end * 1000) : null,
          metadata: JSON.stringify({
            customer_id: subscription.customer,
            plan_id: subscription.metadata?.plan,
            ...subscription.metadata
          })
        }
      });

      logger.info('Subscription updated successfully in database', { subscriptionId: subscription.id, tenantId });
    } catch (error) {
      logger.error('Failed to update subscription in database', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        subscriptionId: subscription.id,
        tenantId 
      });
      throw error;
    }
  }

  /**
   * Handle subscription deleted event
   */
  private static async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const tenantId = subscription.metadata?.tenantId;
    if (!tenantId) {
      logger.error('Subscription deleted without tenantId', { subscriptionId: subscription.id });
      return;
    }

    logger.info('Handling subscription deleted', { subscriptionId: subscription.id, tenantId });
    
    try {
      // Update tenant to remove subscription ID and set status
      await db.tenant.update({
        where: { id: tenantId },
        data: { 
          stripeSubscriptionId: null,
          status: 'cancelled'
        }
      });

      // Update subscription record
      await db.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: 'cancelled',
          endDate: new Date()
        }
      });

      logger.info('Subscription deleted successfully in database', { subscriptionId: subscription.id, tenantId });
    } catch (error) {
      logger.error('Failed to delete subscription in database', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        subscriptionId: subscription.id,
        tenantId 
      });
      throw error;
    }
  }

  /**
   * Handle successful payment event
   */
  private static async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    const invoiceData = invoice as any;
    const subscriptionId = invoiceData.subscription;
    if (!subscriptionId) {
      logger.error('Invoice payment succeeded without subscription', { invoiceId: invoice.id });
      return;
    }

    logger.info('Handling invoice payment succeeded', { invoiceId: invoice.id, subscriptionId });
    
    try {
      // Update subscription record with new period dates
      if (invoice.lines.data[0]?.subscription) {
        const subscription = await getStripe().subscriptions.retrieve(subscriptionId as string);
        const subscriptionData = subscription as any;
        
        await db.subscription.update({
          where: { stripeSubscriptionId: subscriptionId as string },
          data: {
            status: subscription.status,
            currentPeriodStart: subscriptionData.current_period_start ? new Date(subscriptionData.current_period_start * 1000) : new Date(),
            currentPeriodEnd: subscriptionData.current_period_end ? new Date(subscriptionData.current_period_end * 1000) : new Date()
          }
        });
      }

      // Here you could also create a payment record if needed
      // await createPaymentRecord(invoice);

      logger.info('Payment succeeded and subscription updated', { invoiceId: invoice.id, subscriptionId });
    } catch (error) {
      logger.error('Failed to handle payment succeeded', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        invoiceId: invoice.id,
        subscriptionId 
      });
      throw error;
    }
  }

  /**
   * Handle failed payment event
   */
  private static async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    const invoiceData = invoice as any;
    const subscriptionId = invoiceData.subscription;
    if (!subscriptionId) {
      logger.error('Invoice payment failed without subscription', { invoiceId: invoice.id });
      return;
    }

    logger.warn('Handling invoice payment failed', { invoiceId: invoice.id, subscriptionId });
    
    try {
      // Update subscription status to past_due
      await db.subscription.update({
        where: { stripeSubscriptionId: subscriptionId as string },
        data: {
          status: 'past_due'
        }
      });

      // Here you could also create a failed payment record
      // await createFailedPaymentRecord(invoice);

      logger.info('Payment failed and subscription updated to past_due', { invoiceId: invoice.id, subscriptionId });
    } catch (error) {
      logger.error('Failed to handle payment failed', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        invoiceId: invoice.id,
        subscriptionId 
      });
      throw error;
    }
  }

  /**
   * Get customer portal session
   */
  static async createPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<Stripe.BillingPortal.Session> {
    try {
      logger.info('Creating customer portal session', { customerId });

      const session = await getStripe().billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      logger.info('Customer portal session created successfully', { sessionId: session.id, customerId });
      return session;
    } catch (error) {
      logger.error('Failed to create customer portal session', { error: error instanceof Error ? error.message : 'Unknown error', customerId });
      throw new Error('Failed to create portal session');
    }
  }

  /**
   * Get tenant subscription status
   */
  static async getTenantSubscription(tenantId: string) {
    try {
      const subscription = await db.subscription.findFirst({
        where: { tenantId },
        orderBy: { createdAt: 'desc' }
      });

      if (!subscription) {
        return null;
      }

      return {
        id: subscription.id,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        plan: subscription.plan,
        status: subscription.status,
        amount: subscription.amount,
        currency: subscription.currency,
        interval: subscription.interval,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        trialEnd: subscription.trialEnd,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt
      };
    } catch (error) {
      logger.error('Failed to get tenant subscription', { error: error instanceof Error ? error.message : 'Unknown error', tenantId });
      throw new Error('Failed to get subscription');
    }
  }

  /**
   * Check if tenant has active subscription
   */
  static async hasActiveSubscription(tenantId: string): Promise<boolean> {
    try {
      const subscription = await db.subscription.findFirst({
        where: { 
          tenantId,
          status: { in: ['active', 'trialing'] }
        },
        orderBy: { createdAt: 'desc' }
      });

      return !!subscription;
    } catch (error) {
      logger.error('Failed to check tenant subscription status', { error: error instanceof Error ? error.message : 'Unknown error', tenantId });
      return false;
    }
  }

  /**
   * Get tenant usage limits based on subscription plan
   */
  static async getTenantLimits(tenantId: string) {
    try {
      const tenant = await db.tenant.findUnique({
        where: { id: tenantId },
        select: { plan: true }
      });

      if (!tenant) {
        throw new Error('Tenant not found');
      }

      const plan = SUBSCRIPTION_PLANS.find(p => p.id === tenant.plan);
      if (!plan) {
        throw new Error('Plan not found');
      }

      return {
        guardLimit: plan.metadata.guardLimit,
        postLimit: plan.metadata.postLimit,
        apiCallsLimit: plan.metadata.apiCallsLimit,
        features: plan.metadata.features
      };
    } catch (error) {
      logger.error('Failed to get tenant limits', { error: error instanceof Error ? error.message : 'Unknown error', tenantId });
      throw new Error('Failed to get tenant limits');
    }
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
    try {
      return getStripe().webhooks.constructEvent(
        payload,
        signature,
        productionConfig.payment.stripe.webhookSecret
      );
    } catch (error) {
      logger.error('Invalid webhook signature', { error: error instanceof Error ? error.message : 'Unknown error' });
      throw new Error('Invalid webhook signature');
    }
  }
}

export default PaymentService;