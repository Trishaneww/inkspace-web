"use client";

// CSS
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Libs
import type { OnboardingFormState, UsernameStatus } from "@/types/onboarding";

interface ProfilePhaseProps {
  form: OnboardingFormState;
  usernameStatus: UsernameStatus;
  update: (patch: Partial<OnboardingFormState>) => void;
}

export const ProfilePhase = ({
  form,
  usernameStatus,
  update,
}: ProfilePhaseProps) => (
  <>
    <div className={styles.field}>
      <Label htmlFor="onboarding-username">Username</Label>
      <Input
        id="onboarding-username"
        placeholder="your-handle"
        autoComplete="off"
        value={form.username}
        onChange={(e) => update({ username: e.target.value })}
      />
      <UsernameValidationHint status={usernameStatus} />
    </div>

    <div className={styles.field}>
      <Label htmlFor="onboarding-instagram">Instagram (optional)</Label>
      <div className={styles.prefixedInput}>
        <span className={styles.inputPrefix}>https://www.instagram.com/</span>
        <input
          id="onboarding-instagram"
          className={styles.prefixInput}
          placeholder="yourhandle"
          autoComplete="off"
          value={form.instagramHandle}
          onChange={(e) => update({ instagramHandle: e.target.value })}
        />
      </div>
    </div>
  </>
);

const UsernameValidationHint = ({ status }: { status: UsernameStatus }) => {
  switch (status) {
    case "checking":
      return <span className={styles.hint}>Checking availability…</span>;
    case "available":
      return <span className={styles.hintOk}>Available</span>;
    case "taken":
      return <span className={styles.hintError}>That username is taken</span>;
    case "invalid":
      return (
        <span className={styles.hint}>
          3-30 characters: letters, numbers, and underscores
        </span>
      );
    default:
      return null;
  }
};
