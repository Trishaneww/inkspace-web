"use client";

// Next.js
import { useState } from "react";

// CSS
import styles from "@/styles/dashboard/artist/new-requests/NewRequests.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

// Components
import { TriageCard } from "./TriageCard";
import { useNewRequests } from "./NewRequestsContext";

// Libs
import { useAuth } from "@/lib/auth";
import { subscriptionApi } from "@/lib/api/subscription";
import { ApiError } from "@/lib/api/client";
import { displayToast } from "@/lib/toast";

export const NewRequests = () => {
  const { status, isSubscriptionLoading, inquiries, newRequests, markActed } =
    useNewRequests();

  if (isSubscriptionLoading || !status) {
    return (
      <Centered>{<Loader2 size={22} className="animate-spin" />}</Centered>
    );
  }

  if (!status.isPremium) {
    return <PremiumUpsell />;
  }

  if (inquiries === null) {
    return (
      <Centered>{<Loader2 size={22} className="animate-spin" />}</Centered>
    );
  }

  if (newRequests.length === 0) {
    return (
      <Centered>
        <p className={styles.emptyTitle}>You&apos;re all caught up</p>
        <p className={styles.emptyText}>
          New requests will show up here, reviewed and ready to act on.
        </p>
      </Centered>
    );
  }

  return (
    <div className={styles.grid}>
      {newRequests.map((inquiry) => (
        <TriageCard key={inquiry.id} inquiry={inquiry} onActed={markActed} />
      ))}
    </div>
  );
};

const Centered = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.centered}>{children}</div>
);

const PremiumUpsell = () => {
  const { token } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const goPremium = async () => {
    if (!token) return;
    setIsRedirecting(true);
    try {
      const { url } = await subscriptionApi.createCheckout(token);
      window.location.href = url;
    } catch (err) {
      setIsRedirecting(false);
      if (err instanceof ApiError && err.status === 409) {
        window.location.href = "/dashboard/artist/settings?tab=billing";
        return;
      }
      displayToast("Couldn't start checkout", "error");
    }
  };

  return (
    <div className={styles.upsell}>
      <Sparkles className={styles.upsellIcon} />
      <h2 className={styles.upsellTitle}>Let AI work your new requests</h2>
      <p className={styles.upsellText}>
        Premium reviews every new inquiry the moment it lands — a clear
        recommendation, the signals behind it, and a reply drafted in your
        voice. Glance, then act.
      </p>
      <Button
        className={styles.upsellButton}
        onClick={() => void goPremium()}
        disabled={isRedirecting}
      >
        {isRedirecting && <Loader2 size={15} className="animate-spin" />}
        Go Premium
      </Button>
    </div>
  );
};
