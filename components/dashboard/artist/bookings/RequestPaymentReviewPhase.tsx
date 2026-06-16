"use client";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { CreditCard, Lock, ShieldCheck, type LucideIcon } from "lucide-react";

// Components
import {
  ReviewCard,
  ReviewLineItem,
  ReviewNote,
  ReviewSection,
  ReviewTypeBox,
} from "@/components/dashboard/artist/bookings/ReviewPrimitives";

// Libs
import { formatPrice } from "@/lib/formatters";
import {
  computePaymentBreakdown,
  paymentAmountCents,
  PLATFORM_FEE_PERCENT_LABEL,
} from "@/lib/requestPayment";
import { FEE_PAYER_NOTE } from "@/constants/payments";
import { getPaymentTypeLabel, getPaymentTypeHint } from "@/lib/payments";

// Types
import type { Inquiry, PaymentType } from "@/types/bookings";
import type { RequestPaymentForm } from "@/types/payments";
import type { PlatformFeePayer } from "@/types/settings";

const TYPE_ICON: Record<PaymentType, LucideIcon> = {
  deposit: ShieldCheck,
  final: CreditCard,
};

interface RequestPaymentReviewPhaseProps {
  inquiry: Inquiry;
  form: RequestPaymentForm;
  currency: string;
  feePayer: PlatformFeePayer;
}

export const RequestPaymentReviewPhase = ({
  inquiry,
  form,
  currency,
  feePayer,
}: RequestPaymentReviewPhaseProps) => {
  const breakdown = computePaymentBreakdown(paymentAmountCents(form), feePayer);
  const feeAddedToClient = feePayer !== "artist";

  return (
    <div className={styles.editFields}>
      <ReviewCard>
        <ReviewTypeBox
          icon={TYPE_ICON[form.type]}
          label={getPaymentTypeLabel(form.type)}
          hint={getPaymentTypeHint(form.type)}
        />

        <ReviewSection>
          <ReviewLineItem
            label={getPaymentTypeLabel(form.type)}
            value={formatPrice(breakdown.amountCents, currency)}
          />
          <ReviewLineItem
            label={`Platform fee (${PLATFORM_FEE_PERCENT_LABEL})`}
            note={FEE_PAYER_NOTE[feePayer]}
            value={`${feeAddedToClient ? "+" : ""}${formatPrice(breakdown.platformFeeCents, currency)}`}
          />
          <ReviewLineItem
            label="Client pays"
            value={formatPrice(breakdown.clientChargeCents, currency)}
            variant="total"
          />
          <ReviewLineItem
            label="You receive"
            value={formatPrice(breakdown.artistNetCents, currency)}
            variant="muted"
          />
        </ReviewSection>

        <ReviewSection label="Billed to">
          <ReviewLineItem label="Name" value={inquiry.clientName} />
          <ReviewLineItem label="Email" value={inquiry.clientEmail} />
          {inquiry.clientPhone && (
            <ReviewLineItem label="Phone" value={inquiry.clientPhone} />
          )}
        </ReviewSection>

        <ReviewNote icon={Lock}>
          We&apos;ll email {inquiry.clientName} a secure link to pay{" "}
          {formatPrice(breakdown.clientChargeCents, currency)}.
        </ReviewNote>
      </ReviewCard>
    </div>
  );
};
