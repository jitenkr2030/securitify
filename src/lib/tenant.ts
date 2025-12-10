import { db } from '@/lib/db';

export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  subdomain?: string;
  status: 'active' | 'suspended' | 'cancelled';
  plan: 'free' | 'basic' | 'professional' | 'enterprise';
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSetting {
  id: string;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  plan: 'free' | 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate?: Date;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  guardLimit: number;
  postLimit: number;
  apiCallsLimit: number;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Up to 3 guards', 'Basic tracking', 'Email support'],
    guardLimit: 3,
    postLimit: 1,
    apiCallsLimit: 100
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    features: ['Up to 10 guards', 'Basic tracking', 'Email support'],
    guardLimit: 10,
    postLimit: 5,
    apiCallsLimit: 1000
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    features: ['Up to 50 guards', 'Advanced tracking', 'Priority support', 'API access'],
    guardLimit: 50,
    postLimit: 20,
    apiCallsLimit: 5000
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    features: ['Unlimited guards', 'White-label', 'Dedicated support', 'Custom integrations'],
    guardLimit: -1,
    postLimit: -1,
    apiCallsLimit: -1
  }
];

export class TenantService {
  static async createTenant(data: {
    name: string;
    domain?: string;
    subdomain?: string;
    plan?: 'free' | 'basic' | 'professional' | 'enterprise';
  }): Promise<Tenant> {
    const tenant = await db.tenant.create({
      data: {
        name: data.name,
        domain: data.domain,
        subdomain: data.subdomain,
        plan: data.plan || 'basic',
        status: 'active'
      }
    });

    // Create default tenant settings
    await db.tenantSetting.createMany({
      data: [
        { tenantId: tenant.id, key: 'timezone', value: 'UTC' },
        { tenantId: tenant.id, key: 'currency', value: 'USD' },
        { tenantId: tenant.id, key: 'language', value: 'en' },
        { tenantId: tenant.id, key: 'logo_url', value: '' },
        { tenantId: tenant.id, key: 'primary_color', value: '#3b82f6' },
        { tenantId: tenant.id, key: 'secondary_color', value: '#64748b' }
      ]
    });

    // Create initial subscription
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === (data.plan || 'basic'));
    if (plan) {
      await db.subscription.create({
        data: {
          tenantId: tenant.id,
          plan: plan.id,
          status: 'active',
          startDate: new Date(),
          amount: plan.price
        }
      });
    }

    // Convert null to undefined for optional fields
    const result: Tenant = {
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain ?? undefined,
      subdomain: tenant.subdomain ?? undefined,
      status: tenant.status as 'active' | 'suspended' | 'cancelled',
      plan: tenant.plan as 'free' | 'basic' | 'professional' | 'enterprise',
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt
    };

    return result;
  }

  static async getTenantById(id: string): Promise<Tenant | null> {
    const tenant = await db.tenant.findUnique({
      where: { id },
      include: {
        settings: true,
        subscriptions: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!tenant) {
      return null;
    }

    // Convert null to undefined for optional fields
    const result: Tenant = {
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain ?? undefined,
      subdomain: tenant.subdomain ?? undefined,
      status: tenant.status as 'active' | 'suspended' | 'cancelled',
      plan: tenant.plan as 'free' | 'basic' | 'professional' | 'enterprise',
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt
    };

    return result;
  }

  static async getTenantByDomain(domain: string): Promise<Tenant | null> {
    const tenant = await db.tenant.findFirst({
      where: {
        OR: [
          { domain: domain },
          { subdomain: domain }
        ]
      },
      include: {
        settings: true,
        subscriptions: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!tenant) {
      return null;
    }

    // Convert null to undefined for optional fields
    const result: Tenant = {
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain ?? undefined,
      subdomain: tenant.subdomain ?? undefined,
      status: tenant.status as 'active' | 'suspended' | 'cancelled',
      plan: tenant.plan as 'free' | 'basic' | 'professional' | 'enterprise',
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt
    };

    return result;
  }

  static async updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant | null> {
    const tenant = await db.tenant.update({
      where: { id },
      data
    });

    // Convert null to undefined for optional fields
    const result: Tenant = {
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain ?? undefined,
      subdomain: tenant.subdomain ?? undefined,
      status: tenant.status as 'active' | 'suspended' | 'cancelled',
      plan: tenant.plan as 'free' | 'basic' | 'professional' | 'enterprise',
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt
    };

    return result;
  }

  static async getTenantSettings(tenantId: string): Promise<Record<string, string>> {
    const settings = await db.tenantSetting.findMany({
      where: { tenantId }
    });

    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
  }

  static async updateTenantSetting(tenantId: string, key: string, value: string): Promise<TenantSetting> {
    return await db.tenantSetting.upsert({
      where: {
        tenantId_key: { tenantId, key }
      },
      update: { value },
      create: { tenantId, key, value }
    });
  }

  static async getTenantSubscription(tenantId: string): Promise<Subscription | null> {
    const subscription = await db.subscription.findFirst({
      where: {
        tenantId,
        status: 'active'
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!subscription) {
      return null;
    }

    // Convert types to match interface
    const result: Subscription = {
      id: subscription.id,
      plan: subscription.plan as 'free' | 'basic' | 'professional' | 'enterprise',
      status: subscription.status as 'active' | 'cancelled' | 'expired',
      startDate: subscription.startDate,
      endDate: subscription.endDate ?? undefined,
      amount: subscription.amount,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt
    };

    return result;
  }

  static async checkTenantLimits(tenantId: string): Promise<{
    canAddGuards: boolean;
    canAddPosts: boolean;
    currentGuards: number;
    currentPosts: number;
    guardLimit: number;
    postLimit: number;
  }> {
    const subscription = await this.getTenantSubscription(tenantId);
    if (!subscription) {
      throw new Error('No active subscription found');
    }

    const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.plan);
    if (!plan) {
      throw new Error('Invalid subscription plan');
    }

    const [currentGuards, currentPosts] = await Promise.all([
      db.guard.count({
        where: {
          user: { tenantId }
        }
      }),
      db.post.count({
        where: {
          user: { tenantId }
        }
      })
    ]);

    return {
      canAddGuards: plan.guardLimit === -1 || currentGuards < plan.guardLimit,
      canAddPosts: plan.postLimit === -1 || currentPosts < plan.postLimit,
      currentGuards,
      currentPosts,
      guardLimit: plan.guardLimit,
      postLimit: plan.postLimit
    };
  }

  static async extractTenantFromHostname(hostname: string): Promise<string | null> {
    // Remove port if present
    const cleanHostname = hostname.split(':')[0];
    
    // For development, return default tenant
    if (cleanHostname === 'localhost' || cleanHostname === '127.0.0.1') {
      return null;
    }

    // Extract subdomain
    const parts = cleanHostname.split('.');
    if (parts.length > 2) {
      const subdomain = parts[0];
      const tenant = await this.getTenantByDomain(subdomain);
      return tenant?.id || null;
    }

    return null;
  }

  static async createTenantAdmin(tenantId: string, userData: {
    email: string;
    name: string;
    password: string;
  }): Promise<any> {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    return await db.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        role: 'admin',
        tenantId,
        password: hashedPassword
      }
    });
  }
}