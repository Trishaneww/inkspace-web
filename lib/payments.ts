// Libs
import { REQUEST_PAYMENT_TYPE_OPTIONS } from "@/constants/payments";
import { PaymentType } from "@/types/bookings";

// Types
import type {
  PublicPaymentRequest,
  RequestPaymentForm,
} from "@/types/payments";
import type { PlatformFeePayer } from "@/types/settings";
import {
  MIN_CHARGE_CENTS,
  PLATFORM_FEE_MIN_CENTS,
  PLATFORM_FEE_PERCENT,
} from "@/constants/payments";

export function getPaymentTypeLabel(type: PaymentType): string {
  return (
    REQUEST_PAYMENT_TYPE_OPTIONS.find((option) => option.value === type)
      ?.label ?? type
  );
}

export function getPaymentTypeHint(type: PaymentType): string {
  return (
    REQUEST_PAYMENT_TYPE_OPTIONS.find((option) => option.value === type)
      ?.hint ?? ""
  );
}

export interface PaymentBreakdown {
  amountCents: number;
  platformFeeCents: number;
  clientChargeCents: number;
  artistNetCents: number;
}

export const getPaymentBreakdown = (
  amountCents: number,
  feePayer: PlatformFeePayer,
): PaymentBreakdown => {
  const platformFeeCents = Math.max(
    Math.round(amountCents * PLATFORM_FEE_PERCENT),
    PLATFORM_FEE_MIN_CENTS,
  );

  const clientChargeCents =
    feePayer === "client"
      ? amountCents + platformFeeCents
      : feePayer === "split"
        ? amountCents + Math.floor(platformFeeCents / 2)
        : amountCents;

  return {
    amountCents,
    platformFeeCents,
    clientChargeCents,
    artistNetCents: clientChargeCents - platformFeeCents,
  };
};

export const createPaymentForm = (
  defaultDepositCents: number | null,
): RequestPaymentForm => ({
  type: "deposit",
  amount:
    defaultDepositCents != null ? (defaultDepositCents / 100).toString() : "",
});

export const getPaymentAmountCents = (form: RequestPaymentForm): number => {
  const dollars = Number(form.amount);
  return Number.isFinite(dollars) ? Math.round(dollars * 100) : NaN;
};

export const canSubmitPaymentRequest = (form: RequestPaymentForm): boolean => {
  const cents = getPaymentAmountCents(form);
  return Number.isFinite(cents) && cents >= MIN_CHARGE_CENTS;
};

export function isUnavailable(request: PublicPaymentRequest): boolean {
  return (
    request.expired ||
    request.status === "canceled" ||
    request.status === "expired" ||
    request.status === "refunded"
  );
}

export function splitFullName(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return { first: parts[0] ?? "", last: parts.slice(1).join(" ") };
}
