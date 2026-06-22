"use client";

// Next.js
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// CSS
import styles from "@/styles/pay/PayPage.module.css";

// HTML Components
import { CircleAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Components
import { PayStatus } from "@/components/payment/PayStatus";
import { ShowcaseCard } from "@/components/landing/ShowcaseCard";

// Libs
import { paymentsApi } from "@/lib/api/payments";
import { useAuth } from "@/lib/auth";
import { isUnavailable } from "@/lib/payments";
import { formatPrice } from "@/lib/formatters";

// Types
import type { PublicPaymentRequest } from "@/types/payments";

const CLIENT_BOOKINGS_PATH = "/dashboard/client/bookings";

export default function PayPage() {
  const params = useParams<{ token: string }>();
  const token = String(params.token);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [request, setRequest] = useState<PublicPaymentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    paymentsApi
      .getPublic(token)
      .then((res) => active && setRequest(res))
      .catch(() => active && setNotFound(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [token]);

  // Signed-in clients pay from their dashboard.
  useEffect(() => {
    if (!authLoading && user) router.replace(CLIENT_BOOKINGS_PATH);
  }, [authLoading, user, router]);

  function renderContent() {
    if (loading || authLoading || user) {
      return (
        <div className={styles.loading}>
          <Loader2 size={24} className="animate-spin" />
        </div>
      );
    }

    if (notFound || !request) {
      return (
        <PayStatus
          icon={<CircleAlert size={36} className={styles.iconMuted} />}
          title="Payment link not found"
          description="This link may be incorrect or has been removed."
        />
      );
    }

    if (isUnavailable(request) || request.status === "paid") {
      return (
        <PayStatus
          icon={<CircleAlert size={36} className={styles.iconMuted} />}
          title={
            request.status === "paid"
              ? "This payment is already settled"
              : "This link is no longer active"
          }
          description="Reach out to your artist if you think this is a mistake."
        />
      );
    }

    const artist = request.artistName || "your artist";
    const due = formatPrice(request.clientChargeCents, request.currency);
    const label = request.type === "deposit" ? "deposit" : "balance";

    return (
      <div className={styles.signInCard}>
        <span className={styles.eyebrow}>Payment for {artist}</span>
        <h1 className={styles.heading}>
          Sign in to pay your {label} of {due}
        </h1>
        <p className={styles.body}>
          Inkspace keeps your bookings and payments in one place. Log in or
          create an account, then pay securely from your dashboard.
        </p>

        <div className={styles.actions}>
          <Button
            className={styles.primaryBtn}
            nativeButton={false}
            render={<Link href="/login" />}
          >
            Log in
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/signup" />}
          >
            Create an account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.imageSide}>
        <ShowcaseCard />
      </div>

      <div className={styles.contentSide}>{renderContent()}</div>
    </main>
  );
}
