import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tenantId: string;
      tenantName: string;
      tenantPlan: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    tenantId: string;
    tenantName: string;
    tenantPlan: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantId: string;
    tenantName: string;
    tenantPlan: string;
    role: string;
  }
}