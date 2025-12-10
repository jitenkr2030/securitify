"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  return {
    session,
    status,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    user: session?.user,
  };
}

export function useRole(requiredRole: string) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";

  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    if (session.user.role !== requiredRole) {
      router.push("/unauthorized");
    }
  }, [session, status, router, requiredRole]);

  return {
    session,
    status,
    isLoading,
    hasAccess: session?.user.role === requiredRole,
  };
}