// Next.js
import { useCallback, useEffect, useState } from "react";

// Libs
import { useAuth } from "@/lib/auth";
import { subscriptionApi } from "@/lib/api/subscription";
import type { SubscriptionStatus } from "@/types/subscription";

export const useSubscription = (enabled = true) => {
  const { token } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!token) return;
    const data = await subscriptionApi.getStatus(token);
    setStatus(data);
  }, [token]);

  useEffect(() => {
    if (!enabled || !token) return;

    let active = true;
    subscriptionApi
      .getStatus(token)
      .then((data) => {
        if (active) setStatus(data);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [enabled, token]);

  return { status, isLoading, refresh };
};
