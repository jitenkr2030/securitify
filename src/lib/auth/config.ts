import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import * as bcrypt from "bcryptjs";
import { TenantService } from "@/lib/tenant";

// Helper function to ensure demo user exists
async function ensureDemoUserExists(email: string) {
  try {
    // Find or create demo tenant
    let demoTenant = await db.tenant.findFirst({
      where: {
        subdomain: 'demo'
      }
    });

    if (!demoTenant) {
      demoTenant = await db.tenant.create({
        data: {
          name: 'Demo Security Company',
          subdomain: 'demo',
          plan: 'professional',
          status: 'active',
        },
      });

      // Create tenant settings
      await db.tenantSetting.createMany({
        data: [
          { tenantId: demoTenant.id, key: 'timezone', value: 'UTC' },
          { tenantId: demoTenant.id, key: 'currency', value: 'USD' },
          { tenantId: demoTenant.id, key: 'language', value: 'en' },
          { tenantId: demoTenant.id, key: 'logo_url', value: '' },
          { tenantId: demoTenant.id, key: 'primary_color', value: '#3b82f6' },
          { tenantId: demoTenant.id, key: 'secondary_color', value: '#64748b' },
        ],
      });

      // Create subscription
      await db.subscription.create({
        data: {
          tenantId: demoTenant.id,
          plan: 'professional',
          status: 'active',
          startDate: new Date(),
          amount: 99,
        },
      });
    }

    // Hash the demo password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Determine user role based on email
    let userRole = 'admin';
    let userName = 'Demo Administrator';
    
    if (email === 'guard@security.com') {
      userRole = 'guard';
      userName = 'Demo Guard';
    } else if (email === 'officer@security.com') {
      userRole = 'field_officer';
      userName = 'Demo Field Officer';
    }

    // Create or update the demo user
    const demoUser = await db.user.upsert({
      where: {
        email_tenantId: {
          email: email,
          tenantId: demoTenant.id
        }
      },
      update: {},
      create: {
        email: email,
        name: userName,
        password: hashedPassword,
        role: userRole,
        tenantId: demoTenant.id,
      },
    });

    // If it's a guard user, create guard profile
    if (userRole === 'guard') {
      await db.guard.upsert({
        where: {
          phone_userId: {
            phone: '+91 12345 67890',
            userId: demoUser.id
          }
        },
        update: {},
        create: {
          name: 'Demo Security Guard',
          phone: '+91 12345 67890',
          email: email,
          address: '123 Security Street, Demo City',
          status: 'active',
          salary: 25000,
          hourlyRate: 150,
          userId: demoUser.id,
        },
      });
    }

    // Return the user with tenant included
    return await db.user.findFirst({
      where: {
        id: demoUser.id
      },
      include: {
        tenant: true
      }
    });
  } catch (error) {
    console.error('❌ Error ensuring demo user exists:', error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          return null;
        }

        try {
          // Check if this is a demo account
          const isDemoAccount = credentials.email.endsWith('@security.com');
          
          if (isDemoAccount && credentials.password === 'password123') {
            // For demo accounts, ensure they exist in the database
            const demoUser = await ensureDemoUserExists(credentials.email);
            if (demoUser) {
              console.log('✅ Demo user authenticated:', credentials.email);
              return {
                id: demoUser.id,
                email: demoUser.email,
                name: demoUser.name,
                role: demoUser.role,
                tenantId: demoUser.tenantId,
                tenantName: demoUser.tenant.name,
                tenantPlan: demoUser.tenant.plan
              };
            }
          }

          // Find user by email (email is unique per tenant in our schema)
          const user = await db.user.findFirst({
            where: {
              email: credentials.email
            },
            include: {
              tenant: true
            }
          });

          if (!user) {
            console.log('❌ User not found:', credentials.email);
            return null;
          }

          if (!user.password) {
            console.log('❌ No password set for user:', credentials.email);
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            console.log('❌ Invalid password for user:', credentials.email);
            return null;
          }

          // Check if tenant is active
          if (user.tenant.status !== 'active') {
            console.log('❌ Tenant not active:', user.tenant.status);
            throw new Error('Tenant account is suspended or cancelled');
          }

          console.log('✅ Authentication successful for user:', credentials.email);

          // For demo accounts, skip subscription check in development/testing
          const isDevelopment = process.env.NODE_ENV === 'development';
          
          if (!isDemoAccount && !isDevelopment) {
            const subscription = await TenantService.getTenantSubscription(user.tenantId);
            if (!subscription) {
              console.log('❌ No active subscription for tenant:', user.tenantId);
              throw new Error('No active subscription found');
            }
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tenantId: user.tenantId,
            tenantName: user.tenant.name,
            tenantPlan: user.tenant.plan
          };
        } catch (error) {
          console.error('❌ Authorization error:', error);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = user.tenantId;
        token.tenantName = user.tenantName;
        token.tenantPlan = user.tenantPlan;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.tenantId = token.tenantId as string;
        session.user.tenantName = token.tenantName as string;
        session.user.tenantPlan = token.tenantPlan as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin"
  },
  events: {
    async signIn({ user }) {
      // Log successful sign-in with tenant context
      console.log(`✅ User ${user.email} signed in to tenant ${user.tenantId}`);
    },
    async signOut({ token }) {
      console.log(`✅ User signed out from tenant ${token?.tenantId}`);
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
};