"use client";

// CSS
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Label } from "@/components/ui/label";

// Components
import { TattooStylesPicker } from "@/components/common/TattooStylesPicker";

// Libs
import type { OnboardingFormState } from "@/types/onboarding";

interface StylesPhaseProps {
  form: OnboardingFormState;
  update: (patch: Partial<OnboardingFormState>) => void;
}

export const StylesPhase = ({ form, update }: StylesPhaseProps) => (
  <div className={styles.field}>
    <Label>Styles you specialize in</Label>
    <p className={styles.reassure}>
      Choose at least one — clients booking a custom piece can only pick from
      the styles you select.
    </p>
    <TattooStylesPicker
      value={form.styles}
      onChange={(next) => update({ styles: next })}
    />
  </div>
);
