"use client";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Components
import { SegmentedChoice } from "@/components/dashboard/artist/calendar/create/SegmentedChoice";

// Libs
import {
  REQUEST_PAYMENT_TYPE_OPTIONS,
  MIN_CHARGE_DOLLARS,
} from "@/constants/payments";

// Types
import type { PaymentType } from "@/types/bookings";
import type { RequestPaymentForm } from "@/types/payments";

interface RequestPaymentTypePhaseProps {
  form: RequestPaymentForm;
  currency: string;
  selectType: (type: PaymentType) => void;
  update: (patch: Partial<RequestPaymentForm>) => void;
}

export const RequestPaymentTypePhase = ({
  form,
  currency,
  selectType,
  update,
}: RequestPaymentTypePhaseProps) => (
  <div className={styles.editFields}>
    <div className={styles.editField}>
      <Label>What are you charging?</Label>
      <SegmentedChoice
        columns={2}
        options={REQUEST_PAYMENT_TYPE_OPTIONS}
        value={form.type}
        onChange={(value) => selectType(value as PaymentType)}
      />
    </div>

    <div className={styles.editField}>
      <Label htmlFor="payment-amount">Amount ({currency})</Label>
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
    </div>
  </div>
);
