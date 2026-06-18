"use client";

// Next.js
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

// CSS
import styles from "@/styles/pay/PayPage.module.css";

// HTML Components
import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";

// Components
import { ClientSignupCard } from "@/components/payment/ClientSignupCard";
import { PaymentRequestCard } from "@/components/payment/PaymentRequestCard";
import { PayStatus } from "@/components/payment/PayStatus";

// Libs
import { paymentsApi } from "@/lib/api/payments";
import { displayToast } from "@/lib/toast";
import { isUnavailable } from "@/lib/payments";

// Types
import type { PublicPaymentRequest } from "@/types/payments";

export default function PayPage() {
  const params = useParams<{ token: string }>();
  const token = String(params.token);
  const search = useSearchParams();
  const returnedFromStripe = search.get("status") === "success";

  const [request, setRequest] = useState<PublicPaymentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

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

  // Confirm the payment with a toast the moment the client lands back here.
  useEffect(() => {
    if (returnedFromStripe) {
      displayToast(
        "Payment successful — your booking is confirmed.",
        "success",
      );
    }
  }, [returnedFromStripe]);

  const startCheckout = async () => {
    setPaying(true);
    setPayError(null);
    try {
      const { url } = await paymentsApi.createCheckout(token);
      window.location.href = url;
    } catch {
      setPayError("Couldn't start checkout. Please try again.");
      setPaying(false);
    }
  };

  function renderContent() {
    if (loading) {
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

    if (request.status === "paid" || returnedFromStripe) {
      if (!request.hasAccount) {
        return (
          <ClientSignupCard
            token={token}
            email={request.clientEmail}
            name={request.clientName}
            artist={request.artistName || "your artist"}
          />
        );
      }
      return (
        <PayStatus
          icon={<CheckCircle2 size={36} className={styles.iconSuccess} />}
          title="Payment complete"
          description={
            request.status === "paid"
              ? "Thank you, your payment has been received. Your booking is confirmed."
              : "Thank you, we're confirming your payment now."
          }
        />
      );
    }

    if (isUnavailable(request)) {
      return (
        <PayStatus
          icon={<CircleAlert size={36} className={styles.iconMuted} />}
          title="This link is no longer active"
          description="Reach out to your artist for an up-to-date payment link."
        />
      );
    }

    return (
      <PaymentRequestCard
        request={request}
        paying={paying}
        payError={payError}
        onStartCheckout={startCheckout}
      />
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.imageSide}>
        <Image
          src="/inkspace-dashboard.png"
          alt="Inkspace dashboard preview"
          width={1000}
          height={2000}
          className={styles.image}
          priority
        />
      </div>

      <div className={styles.contentSide}>{renderContent()}</div>
    </main>
  );
}
