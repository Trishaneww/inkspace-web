// Types
import type { PaymentType } from "@/types/bookings";
import type { PlatformFeePayer } from "@/types/settings";

export const REQUEST_PAYMENT_TYPE_OPTIONS: {
  value: PaymentType;
  label: string;
  hint: string;
}[] = [
  { value: "deposit", label: "Deposit", hint: "Secure the booking" },
  { value: "final", label: "Full payment", hint: "Charge the full session" },
];

export const FEE_PAYER_NOTE: Record<PlatformFeePayer, string> = {
  client: "Added to the client's total",
  artist: "Deducted from your payout",
  split: "Split with the client",
};

export const PAYABLE_PAYMENT_STATUSES = new Set(["requested", "processing"]);

export const MIN_CHARGE_CENTS = 1000;
export const MIN_CHARGE_DOLLARS = MIN_CHARGE_CENTS / 100;
export const PLATFORM_FEE_PERCENT = 0.06;
export const PLATFORM_FEE_MIN_CENTS = 200;
export const PLATFORM_FEE_PERCENT_LABEL = `${Number((PLATFORM_FEE_PERCENT * 100).toFixed(2))}%`;