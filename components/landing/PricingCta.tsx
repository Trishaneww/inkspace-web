"use client";

// Next.js
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Libs
import { useAuth, postAuthRedirect } from "@/lib/auth";
import { ApiError } from "@/lib/api/client";
import { subscriptionApi } from "@/lib/api/subscription";
import { UserRole } from "@/types/index";
import type { PricingTier } from "@/constants/landing";

interface PricingCtaProps {
  tier: PricingTier;
  className: string;
}

export const PricingCta = ({ tier, className }: PricingCtaProps) => {
  if (tier.ctaAction === "subscribe") {
    return <SubscribeButton tier={tier} className={className} />;
  }

  return (
    <Link href={tier.ctaHref} className={className}>
      {tier.ctaLabel}
    </Link>
  );
};

const SubscribeButton = ({ tier, className }: PricingCtaProps) => {
  const { user, isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const startCheckout = async () => {
    if (!isAuthenticated || !user || !token || user.role !== UserRole.Artist) {
      router.push(tier.ctaHref);
      return;
    }

    setIsRedirecting(true);
    try {
      const { url } = await subscriptionApi.createCheckout(token);
      window.location.href = url;
    } catch (err) {
      setIsRedirecting(false);
      if (err instanceof ApiError && err.status === 409) {
        router.push(postAuthRedirect(user));
        return;
      }
      console.error("subscription checkout failed", err);
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={startCheckout}
      disabled={isRedirecting}
    >
      {isRedirecting ? "Redirecting" : tier.ctaLabel}
    </button>
  );
};
