"use client";

// Next.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

/**
 * Client-side gate for protected routes. Wrap a route layout with this so
 * unauthenticated visitors get bounced to /login.
 *
 * Tokens currently live in localStorage, so a Next.js middleware can't
 * inspect them at the edge. If/when we move tokens to httpOnly cookies,
 * promote this gate into `middleware.ts` for true server-side enforcement.
 */
export const RequireAuth = ({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return <>{fallback}</>;
  return <>{children}</>;
};
