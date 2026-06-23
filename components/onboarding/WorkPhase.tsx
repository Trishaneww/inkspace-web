"use client";

// CSS
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Components
import { TattooStylesPicker } from "@/components/common/TattooStylesPicker";
import { ChipMultiSelect } from "@/components/common/ChipMultiSelect";

// Libs
import { PLACEMENT_CHIP_OPTIONS } from "@/constants/settings";
import { formatCurrency } from "@/lib/formatters";
import type { OnboardingFormState } from "@/types/onboarding";

interface WorkPhaseProps {
  form: OnboardingFormState;
  update: (patch: Partial<OnboardingFormState>) => void;
}

export const WorkPhase = ({ form, update }: WorkPhaseProps) => (
  <div className={styles.fields}>
    <p className={styles.reassure}>
      All optional — this just helps our AI assistant review new requests in your
      favour. You can change any of it later in Settings.
    </p>

    <div className={styles.field}>
      <Label htmlFor="onboarding-min-price">Minimum session price</Label>
      <Input
        id="onboarding-min-price"
        inputMode="decimal"
        placeholder="e.g. 200"
        value={form.minSessionPrice}
        onChange={(event) =>
          update({ minSessionPrice: formatCurrency(event.target.value) })
        }
      />
    </div>

    <div className={styles.field}>
      <Label>Styles you don&apos;t do</Label>
      <TattooStylesPicker
        value={form.declinedStyles}
        onChange={(declinedStyles) => update({ declinedStyles })}
      />
    </div>

    <div className={styles.field}>
      <Label>Placements you won&apos;t tattoo</Label>
      <ChipMultiSelect
        value={form.declinedPlacements}
        options={PLACEMENT_CHIP_OPTIONS}
        onChange={(declinedPlacements) => update({ declinedPlacements })}
      />
    </div>

    <div className={styles.field}>
      <Label htmlFor="onboarding-work-summary">About your work</Label>
      <Textarea
        id="onboarding-work-summary"
        rows={4}
        placeholder="What you specialize in, what you take, and what you turn down — in your words."
        value={form.workSummary}
        onChange={(event) => update({ workSummary: event.target.value })}
      />
    </div>
  </div>
);
