"use client";

// Next.js
import Image from "next/image";

// CSS
import styles from "@/styles/pay/PayPage.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Libs
import { formatPrice } from "@/lib/formatters";

// Types
import type { PublicPaymentRequest } from "@/types/payments";

export const PaymentRequestCard = ({
  request,
  paying,
  payError,
  onStartCheckout,
}: {
  request: PublicPaymentRequest;
  paying: boolean;
  payError: string | null;
  onStartCheckout: () => void;
}) => {
  const isDeposit = request.type === "deposit";
  const amount = formatPrice(request.clientChargeCents, request.currency);
  const artist = request.artistName || "Your artist";

  return (
    <div className={styles.content}>
      <Image
        src="/logos/inkspace-logo.svg"
        alt="Inkspace"
        width={88}
        height={88}
        priority
      />
      <h1 className={styles.title}>
        {isDeposit ? "Secure your booking" : "Complete your payment"}
      </h1>
      <p className={styles.description}>
        {isDeposit
          ? `${artist} has requested a deposit to lock in your booking. Pay securely via Stripe — your spot is confirmed once received.`
          : `${artist} has requested payment for your tattoo session. Pay securely via Stripe in just a few seconds.`}
      </p>

      <div className={styles.summary}>
        <span className={styles.summaryLabel}>
          {isDeposit ? "Deposit due" : "Amount due"}
        </span>
        <span className={styles.summaryAmount}>{amount}</span>
      </div>

      {payError && <p className={styles.error}>{payError}</p>}

      <Button onClick={onStartCheckout} disabled={paying} className={styles.cta}>
        {paying && <Loader2 size={16} className="animate-spin" />}
        Go to payment page
      </Button>

      <p className={styles.secureNote}>
        Payments are processed securely by Stripe.
      </p>
    </div>
  );
};
