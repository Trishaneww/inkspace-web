"use client";

// Next.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Libs
import { postAuthRedirect, useAuth } from "@/lib/auth";

export default function DashboardRootPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.replace(postAuthRedirect(user));
  }, [user, router]);

  return null;
}
