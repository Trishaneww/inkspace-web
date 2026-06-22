"use client";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { CreditCard, Lock, type LucideIcon } from "lucide-react";

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
import { getFinalPaymentBreakdown, getPaymentAmountCents } from "@/lib/payments";
import {
  FEE_PAYER_NOTE,
  PLATFORM_FEE_PERCENT_LABEL,
} from "@/constants/payments";

// Types
import type { Inquiry } from "@/types/bookings";
import type { RequestPaymentForm } from "@/types/payments";
import type { PlatformFeePayer } from "@/types/settings";

const TYPE_ICON: LucideIcon = CreditCard;

interface RequestPaymentReviewPhaseProps {
  inquiry: Inquiry;
  form: RequestPaymentForm;
  currency: string;
  feePayer: PlatformFeePayer;
  depositPaidCents: number;
}

export const RequestPaymentReviewPhase = ({
  inquiry,
  form,
  currency,
  feePayer,
  depositPaidCents,
}: RequestPaymentReviewPhaseProps) => {
  const breakdown = getFinalPaymentBreakdown(
    getPaymentAmountCents(form),
    depositPaidCents,
    feePayer,
  );
  const feeAddedToClient = feePayer !== "artist";

  return (
    <div className={styles.editFields}>
      <ReviewCard>
        <ReviewTypeBox
          icon={TYPE_ICON}
          label="Full payment"
          hint="Charge the remaining balance"
        />

        <ReviewSection>
          <ReviewLineItem
            label="Job total"
            value={formatPrice(breakdown.jobTotalCents, currency)}
          />
          {breakdown.depositAppliedCents > 0 && (
            <ReviewLineItem
              label="Deposit paid"
              value={`−${formatPrice(breakdown.depositAppliedCents, currency)}`}
            />
          )}
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
