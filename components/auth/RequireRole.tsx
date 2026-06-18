"use client";

// Next.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Libs
import { postAuthRedirect, useAuth } from "@/lib/auth";
import { UserRole } from "@/types/index";

export const RequireRole = ({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const allowed = user?.role === role;

  useEffect(() => {
    if (!isLoading && user && !allowed) {
      router.replace(postAuthRedirect(user));
    }
  }, [isLoading, user, allowed, router]);

  if (isLoading || !allowed) return null;
  return <>{children}</>;
};
