"use client";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Libs
import { MIN_CHARGE_DOLLARS } from "@/constants/payments";

// Types
import type { RequestPaymentForm } from "@/types/payments";

interface RequestPaymentTypePhaseProps {
  form: RequestPaymentForm;
  currency: string;
  update: (patch: Partial<RequestPaymentForm>) => void;
}

export const RequestPaymentTypePhase = ({
  form,
  currency,
  update,
}: RequestPaymentTypePhaseProps) => (
  <div className={styles.editFields}>
    <div className={styles.editField}>
      <Label htmlFor="payment-amount">Job total ({currency})</Label>
      <Input
        id="payment-amount"
        type="number"
        min={MIN_CHARGE_DOLLARS}
        step="1"
        inputMode="decimal"
        placeholder="0.00"
        value={form.amount}
        onChange={(event) => update({ amount: event.target.value })}
      />
      <p className={styles.editHint}>
        Enter the full price of the piece. Any deposit already paid is subtracted
        on the next step.
      </p>
    </div>
  </div>
);
