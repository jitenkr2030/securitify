import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { TenantService } from "@/lib/tenant";

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
          const isDemoAccount = credentials.email.endsWith('@security.com');
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
  secret: process.env.NEXTAUTH_SECRET,
};