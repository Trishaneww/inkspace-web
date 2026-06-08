"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Libs
import { SCHEDULING_OPTIONS } from "@/constants/onboarding";
import type { OnboardingFormState } from "@/types/onboarding";

interface BookingsPhaseProps {
  form: OnboardingFormState;
  update: (patch: Partial<OnboardingFormState>) => void;
}

export const BookingsPhase = ({ form, update }: BookingsPhaseProps) => (
  <>
    <div className={styles.field}>
      <Label>How do you want to schedule?</Label>
      <div className={styles.choiceCards}>
        {SCHEDULING_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.value}
              type="button"
              className={
                form.schedulingMode === opt.value
                  ? clsx(styles.choiceCard, styles.choiceCardActive)
                  : styles.choiceCard
              }
              onClick={() => update({ schedulingMode: opt.value })}
            >
              <span className={styles.choiceIcon}>
                <Icon size={18} />
              </span>
              <span className={styles.choiceLabel}>{opt.label}</span>
              <span className={styles.choiceDescription}>
                {opt.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
    <div className={styles.field}>
      <Label htmlFor="onboarding-deposit">Deposit amount (optional)</Label>
      <Input
        id="onboarding-deposit"
        type="number"
        min={0}
        step="1"
        placeholder="0.00"
        value={form.deposit}
        onChange={(e) => update({ deposit: e.target.value })}
      />
    </div>
  </>
);
