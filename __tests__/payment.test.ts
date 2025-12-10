import PaymentService, { SUBSCRIPTION_PLANS } from '@/lib/payment/stripe';
import { db } from '@/lib/db';
import { productionConfig } from '@/lib/production-config';

// Mock dependencies
jest.mock('@/lib/db', () => ({
  db: {
    tenant: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    subscription: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('@/lib/monitoring', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Stripe
jest.mock('stripe', () => {
  const mockStripe = {
    customers: {
      create: jest.fn().mockResolvedValue({
        id: 'cus_test123',
        email: 'test@example.com',
        name: 'Test Customer',
      }),
    },
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          id: 'cs_test123',
          url: 'https://checkout.stripe.com/test',
        }),
      },
    },
    prices: {
      create: jest.fn().mockResolvedValue({
        id: 'price_test123',
        unit_amount: 4900,
        currency: 'usd',
      }),
    },
    subscriptions: {
      update: jest.fn().mockResolvedValue({
        id: 'sub_test123',
        cancel_at_period_end: true,
      }),
      cancel: jest.fn().mockResolvedValue({
        id: 'sub_test123',
        status: 'canceled',
        cancel_at_period_end: false,
      }),
      retrieve: jest.fn().mockResolvedValue({
        id: 'sub_test123',
        status: 'active',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 2592000,
      }),
    },
    billingPortal: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          id: 'bps_test123',
          url: 'https://billing.stripe.com/test',
        }),
      },
    },
    webhooks: {
      constructEvent: jest.fn().mockReturnValue({
        id: 'evt_test123',
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_test123',
            metadata: { tenantId: 'tenant_test123' },
            current_period_start: Math.floor(Date.now() / 1000),
            current_period_end: Math.floor(Date.now() / 1000) + 2592000,
            items: {
              data: [{
                price: {
                  id: 'price_test123',
                  unit_amount: 4900,
                  currency: 'usd',
                  recurring: { interval: 'month' },
                },
              }],
            },
          },
        },
      }),
    },
  };
  
  return jest.fn().mockImplementation(() => mockStripe);
});

// Get mocked db for test usage
const mockedDb = require('@/lib/db').db as jest.Mocked<typeof db>;

// Get mocked stripe instance
const getMockedStripe = () => {
  const Stripe = require('stripe');
  return new Stripe();
};

// Mock production config
jest.mock('@/lib/production-config', () => ({
  productionConfig: {
    app: {
      name: 'Securitify',
      url: 'http://localhost:3000',
      env: 'test' as const,
      version: '1.0.0',
    },
    email: {
      smtp: {
        host: '',
        port: 587,
        secure: false,
        auth: { user: '', pass: '' },
      },
      from: 'test@test.com',
    },
    security: {
      cors: { origins: ['http://localhost:3000'], credentials: true },
      rateLimit: { windowMs: 900000, max: 100 },
      headers: {
        csp: "default-src 'self'",
        permissionsPolicy: 'camera=(), microphone=(), geolocation=()',
      },
    },
    database: { pool: { min: 2, max: 10 }, logging: false },
    payment: {
      stripe: {
        publishableKey: 'pk_test',
        secretKey: 'sk_test',
        webhookSecret: 'whsec_test',
      },
    },
    storage: { provider: 'local' as const },
    monitoring: {
      enabled: false,
      serviceName: 'securityguard-pro',
      version: '1.0.0',
    },
  },
}));

describe('PaymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SUBSCRIPTION_PLANS', () => {
    it('should have three subscription plans', () => {
      expect(SUBSCRIPTION_PLANS).toHaveLength(3);
      expect(SUBSCRIPTION_PLANS.map(p => p.id)).toEqual(['basic', 'professional', 'enterprise']);
    });

    it('should have correct pricing for basic plan', () => {
      const basicPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'basic');
      expect(basicPlan).toEqual(
        expect.objectContaining({
          id: 'basic',
          name: 'Basic',
          price: 49,
          currency: 'usd',
          interval: 'month',
        })
      );
    });

    it('should have correct guard limits', () => {
      const basicPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'basic');
      const professionalPlan = SUBSCRIPTION_PLANS.find(p => p.id === 'professional');
      const enterprisePlan = SUBSCRIPTION_PLANS.find(p => p.id === 'enterprise');

      expect(basicPlan?.metadata.guardLimit).toBe(10);
      expect(professionalPlan?.metadata.guardLimit).toBe(50);
      expect(enterprisePlan?.metadata.guardLimit).toBe(-1); // Unlimited
    });
  });

  describe('createCustomer', () => {
    it('should create Stripe customer successfully', async () => {
      const customer = await PaymentService.createCustomer(
        'test@example.com',
        'Test Customer',
        'tenant_test123'
      );

      expect(customer).toEqual(
        expect.objectContaining({
          id: 'cus_test123',
          email: 'test@example.com',
          name: 'Test Customer',
        })
      );
    });

    it('should throw error when Stripe customer creation fails', async () => {
      const stripe = getMockedStripe();
      stripe.customers.create.mockRejectedValueOnce(new Error('Stripe error'));

      await expect(
        PaymentService.createCustomer('test@example.com', 'Test Customer', 'tenant_test123')
      ).rejects.toThrow('Failed to create customer');
    });
  });

  describe('createCheckoutSession', () => {
    it('should create checkout session successfully', async () => {
      const session = await PaymentService.createCheckoutSession(
        'cus_test123',
        'price_test123',
        'tenant_test123',
        'http://localhost:3000/success',
        'http://localhost:3000/cancel'
      );

      expect(session).toEqual(
        expect.objectContaining({
          id: 'cs_test123',
          url: 'https://checkout.stripe.com/test',
        })
      );
    });
  });

  describe('createPrice', () => {
    it('should create Stripe price successfully', async () => {
      const plan = SUBSCRIPTION_PLANS[0]; // Basic plan
      const price = await PaymentService.createPrice(plan);

      expect(price).toEqual(
        expect.objectContaining({
          id: 'price_test123',
          unit_amount: 4900, // 49 * 100
          currency: 'usd',
        })
      );
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription at period end', async () => {
      const subscription = await PaymentService.cancelSubscription('sub_test123', false);

      expect(subscription).toEqual(
        expect.objectContaining({
          id: 'sub_test123',
          cancel_at_period_end: true,
        })
      );
    });

    it('should cancel subscription immediately', async () => {
      const stripe = getMockedStripe();
      stripe.subscriptions.update.mockResolvedValueOnce({
        id: 'sub_test123',
        cancel_at_period_end: false,
        status: 'canceled', // The update should return the canceled status
      });
      
      stripe.subscriptions.cancel.mockResolvedValueOnce({
        id: 'sub_test123',
        status: 'canceled',
        cancel_at_period_end: false,
      });

      const subscription = await PaymentService.cancelSubscription('sub_test123', true);

      expect(subscription).toEqual(
        expect.objectContaining({
          id: 'sub_test123',
          status: 'canceled',
        })
      );
    });
  });

  describe('getSubscription', () => {
    it('should retrieve subscription details', async () => {
      const subscription = await PaymentService.getSubscription('sub_test123');

      expect(subscription).toEqual(
        expect.objectContaining({
          id: 'sub_test123',
          status: 'active',
        })
      );
    });
  });

  describe('createPortalSession', () => {
    it('should create customer portal session', async () => {
      const session = await PaymentService.createPortalSession(
        'cus_test123',
        'http://localhost:3000/dashboard'
      );

      expect(session).toEqual(
        expect.objectContaining({
          id: 'bps_test123',
          url: 'https://billing.stripe.com/test',
        })
      );
    });
  });

  describe('verifyWebhookSignature', () => {
    it('should verify webhook signature', () => {
      const event = PaymentService.verifyWebhookSignature(
        'test-payload',
        'test-signature'
      );

      expect(event).toEqual(
        expect.objectContaining({
          id: 'evt_test123',
          type: 'customer.subscription.created',
        })
      );
    });

    it('should throw error for invalid signature', () => {
      const stripe = getMockedStripe();
      stripe.webhooks.constructEvent.mockImplementationOnce(() => {
        throw new Error('Invalid signature');
      });

      expect(() => {
        PaymentService.verifyWebhookSignature('test-payload', 'invalid-signature');
      }).toThrow('Invalid webhook signature');
    });
  });

  describe('handleWebhookEvent', () => {
    it('should handle customer.subscription.created event', async () => {
      const mockEvent = {
        id: 'evt_test123',
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_test123',
            metadata: { tenantId: 'tenant_test123' },
            current_period_start: Math.floor(Date.now() / 1000),
            current_period_end: Math.floor(Date.now() / 1000) + 2592000,
            items: {
              data: [{
                price: {
                  id: 'price_test123',
                  unit_amount: 9900,
                  currency: 'usd',
                  recurring: { interval: 'month' },
                },
              }],
            },
          },
        },
      };

      mockedDb.tenant.update.mockResolvedValue({});
      mockedDb.subscription.create.mockResolvedValue({});

      await expect(PaymentService.handleWebhookEvent(mockEvent as any)).resolves.not.toThrow();

      expect(mockedDb.tenant.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'tenant_test123' },
          data: expect.objectContaining({
            stripeSubscriptionId: 'sub_test123',
          }),
        })
      );
    });

    it('should handle unhandled event types', async () => {
      const mockEvent = {
        id: 'evt_test123',
        type: 'unhandled.event',
        data: { object: {} },
      };

      await expect(PaymentService.handleWebhookEvent(mockEvent as any)).resolves.not.toThrow();
    });
  });

  describe('getTenantSubscription', () => {
    it('should return null when no subscription found', async () => {
      mockedDb.subscription.findFirst.mockResolvedValue(null);

      const subscription = await PaymentService.getTenantSubscription('tenant_test123');

      expect(subscription).toBeNull();
    });

    it('should return subscription when found', async () => {
      const mockSubscription = {
        id: 'sub_test123',
        stripeSubscriptionId: 'sub_test123',
        plan: 'professional',
        status: 'active',
        amount: 99,
        currency: 'usd',
        interval: 'month',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedDb.subscription.findFirst.mockResolvedValue(mockSubscription);

      const subscription = await PaymentService.getTenantSubscription('tenant_test123');

      expect(subscription).toEqual(mockSubscription);
    });
  });

  describe('hasActiveSubscription', () => {
    it('should return true when active subscription exists', async () => {
      mockedDb.subscription.findFirst.mockResolvedValue({
        id: 'sub_test123',
        status: 'active',
      });

      const hasActive = await PaymentService.hasActiveSubscription('tenant_test123');

      expect(hasActive).toBe(true);
    });

    it('should return false when no active subscription', async () => {
      mockedDb.subscription.findFirst.mockResolvedValue(null);

      const hasActive = await PaymentService.hasActiveSubscription('tenant_test123');

      expect(hasActive).toBe(false);
    });
  });

  describe('getTenantLimits', () => {
    it('should return correct limits for basic plan', async () => {
      const mockTenant = {
        id: 'tenant_test123',
        plan: 'basic',
      };

      mockedDb.tenant.findUnique.mockResolvedValue(mockTenant);

      const limits = await PaymentService.getTenantLimits('tenant_test123');

      expect(limits).toEqual(
        expect.objectContaining({
          guardLimit: 10,
          postLimit: 5,
          apiCallsLimit: 1000,
        })
      );
    });

    it('should throw error when tenant not found', async () => {
      mockedDb.tenant.findUnique.mockResolvedValue(null);

      await expect(PaymentService.getTenantLimits('tenant_test123')).rejects.toThrow('Failed to get tenant limits');
    });
  });
});