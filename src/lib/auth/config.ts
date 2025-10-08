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
          return null;
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

        if (!user || !user.password) {
          return null;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          return null;
        }

        // Check if tenant is active
        if (user.tenant.status !== 'active') {
          throw new Error('Tenant account is suspended or cancelled');
        }

        // Temporarily skip subscription check for testing
        // const subscription = await TenantService.getTenantSubscription(user.tenantId);
        // if (!subscription) {
        //   throw new Error('No active subscription found');
        // }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId,
          tenantName: user.tenant.name,
          tenantPlan: user.tenant.plan
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
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
      console.log(`User ${user.email} signed in to tenant ${user.tenantId}`);
    }
  }
};