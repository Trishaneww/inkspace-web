"use client";

// Next.js
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// CSS
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Components
import { StaticCard, CardRow } from "./SettingsPrimitives";

// Hooks
import { useSubscription } from "@/hooks/useSubscription";

// Libs
import { useAuth } from "@/lib/auth";
import { subscriptionApi } from "@/lib/api/subscription";
import { displayToast } from "@/lib/toast";
import { planDescription } from "@/lib/subscription";

export const BillingTab = () => {
  const { token } = useAuth();
  const { status, isLoading, refresh } = useSubscription();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const subscriptionReturn = searchParams.get("subscription");
  const handledReturn = useRef(false);
  useEffect(() => {
    if (!subscriptionReturn || handledReturn.current) return;
    handledReturn.current = true;
    if (subscriptionReturn === "success") {
      displayToast(
        "Welcome to Premium",
        "success",
        "Your subscription is active.",
      );
      void refresh().catch(() => {});
    }
    router.replace("/dashboard/artist/settings?tab=billing");
  }, [subscriptionReturn, refresh, router]);

  if (isLoading || !status) return null;

  const startCheckout = async () => {
    if (!token) return;
    setIsRedirecting(true);
    try {
      const { url } = await subscriptionApi.createCheckout(token);
      window.location.href = url;
    } catch {
      setIsRedirecting(false);
      displayToast(
        "Couldn't start checkout",
        "error",
        "Please try again in a moment.",
      );
    }
  };

  const openPortal = async () => {
    if (!token) return;
    setIsRedirecting(true);
    try {
      const { url } = await subscriptionApi.createPortal(token);
      window.location.href = url;
    } catch {
      setIsRedirecting(false);
      displayToast(
        "Couldn't open the billing portal",
        "error",
        "Please try again in a moment.",
      );
    }
  };

  return (
    <StaticCard
      title="Subscription"
      description="Your Inkspace plan and billing."
    >
      <CardRow label="Plan" description={planDescription(status)} alwaysOn>
        {status.isPremium ? (
          <Button
            variant="outline"
            onClick={() => void openPortal()}
            disabled={isRedirecting}
          >
            {isRedirecting && <Loader2 size={15} className="animate-spin" />}
            Manage subscription
          </Button>
        ) : (
          <Button
            className={styles.primaryButton}
            onClick={() => void startCheckout()}
            disabled={isRedirecting}
          >
            {isRedirecting && <Loader2 size={15} className="animate-spin" />}
            Go Premium
          </Button>
        )}
      </CardRow>
    </StaticCard>
  );
};
