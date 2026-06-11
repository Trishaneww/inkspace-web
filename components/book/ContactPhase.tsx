"use client";

// CSS
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Libs
import { formatPhone } from "@/lib/formatters";
import type {
  BookingFlowFormState,
  UpdateBookingForm,
} from "@/types/bookingFlow";

interface ContactPhaseProps {
  form: BookingFlowFormState;
  update: UpdateBookingForm;
}

export const ContactPhase = ({ form, update }: ContactPhaseProps) => {
  return (
    <>
      <div className={styles.field}>
        <Label htmlFor="ob-name">Your name</Label>
        <Input
          id="ob-name"
          value={form.clientName}
          placeholder="Jane Doe"
          onChange={(e) => update({ clientName: e.target.value })}
        />
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <Label htmlFor="ob-email">Email</Label>
          <Input
            id="ob-email"
            type="email"
            value={form.clientEmail}
            placeholder="jane@email.com"
            onChange={(e) => update({ clientEmail: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <Label htmlFor="ob-phone">Phone</Label>
          <Input
            id="ob-phone"
            type="tel"
            value={form.clientPhone}
            placeholder="+1 (416) 123-4567"
            onChange={(e) =>
              update({ clientPhone: formatPhone(e.target.value) })
            }
          />
        </div>
      </div>
    </>
  );
};
