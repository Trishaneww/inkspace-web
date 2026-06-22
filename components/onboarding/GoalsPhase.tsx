"use client";

// CSS
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Types
import type { OnboardingFormState } from "@/types/onboarding";

interface GoalsPhaseProps {
  form: OnboardingFormState;
  update: (patch: Partial<OnboardingFormState>) => void;
}

export const GoalsPhase = ({ form, update }: GoalsPhaseProps) => (
  <div className={styles.field}>
    <Label htmlFor="onboarding-goal">Bookings per month</Label>
    <Input
      id="onboarding-goal"
      type="number"
      min={1}
      step="1"
      placeholder="20"
      value={form.monthlyBookingGoal}
      onChange={(event) => update({ monthlyBookingGoal: event.target.value })}
    />
    <span className={styles.hint}>
      Pick a number that feels exciting but doable. We&apos;ll track your
      progress on your dashboard, and you can change it anytime.
    </span>
  </div>
);
