"use client";

// CSS
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Libs
import { formatSelectValue } from "@/lib/formatters";
import { TIMEZONE_OPTIONS } from "@/constants/settings";
import type { OnboardingFormState } from "@/types/onboarding";

interface StudioPhaseProps {
  form: OnboardingFormState;
  update: (patch: Partial<OnboardingFormState>) => void;
}

export const StudioPhase = ({ form, update }: StudioPhaseProps) => {
  return (
    <>
      <div className={styles.field}>
        <Label htmlFor="onboarding-studio-name">Studio name</Label>
        <Input
          id="onboarding-studio-name"
          value={form.studioName}
          onChange={(e) => update({ studioName: e.target.value })}
        />
      </div>
      <div className={styles.field}>
        <Label htmlFor="onboarding-studio-address">Address</Label>
        <Input
          id="onboarding-studio-address"
          value={form.studioAddress}
          onChange={(e) => update({ studioAddress: e.target.value })}
        />
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <Label htmlFor="onboarding-studio-city">City</Label>
          <Input
            id="onboarding-studio-city"
            value={form.studioCity}
            onChange={(e) => update({ studioCity: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <Label htmlFor="onboarding-studio-province">Province</Label>
          <Input
            id="onboarding-studio-province"
            value={form.studioProvince}
            onChange={(e) => update({ studioProvince: e.target.value })}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <Label htmlFor="onboarding-studio-postal">Postal code</Label>
          <Input
            id="onboarding-studio-postal"
            value={form.studioPostalCode}
            onChange={(e) => update({ studioPostalCode: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <Label htmlFor="onboarding-studio-country">Country</Label>
          <Input
            id="onboarding-studio-country"
            value={form.studioCountry}
            onChange={(e) => update({ studioCountry: e.target.value })}
          />
        </div>
      </div>
      <div className={styles.field}>
        <Label htmlFor="onboarding-timezone">Timezone</Label>
        <Select
          value={form.timezone}
          onValueChange={(value) => update({ timezone: value ?? "" })}
        >
          <SelectTrigger
            id="onboarding-timezone"
            className={styles.selectTrigger}
          >
            <SelectValue placeholder="Select a timezone">
              {(value) =>
                value
                  ? formatSelectValue(value, TIMEZONE_OPTIONS)
                  : "Select a timezone"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {TIMEZONE_OPTIONS.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
