"use client";

// CSS
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Loader2 } from "lucide-react";

// Libs
import { OnboardingPhase } from "@/types/onboarding";

interface OnboardingDialogFooterProps {
  phase: OnboardingPhase;
  submitting: boolean;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
  onDismiss: () => void;
}

export const OnboardingDialogFooter = ({
  phase,
  submitting,
  canProceed,
  onNext,
  onBack,
  onDismiss,
}: OnboardingDialogFooterProps) => {
  const isComplete = phase === OnboardingPhase.Complete;
  const isLastInputPhase = phase === OnboardingPhase.Bookings;

  return (
    <DialogFooter className={styles.footer}>
      <div className={styles.footerLeft}>
        {!isComplete && phase !== OnboardingPhase.Profile && (
          <Button
            type="button"
            className={styles.backLink}
            disabled={submitting}
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        )}
      </div>
      <div className={styles.footerRight}>
        {isComplete ? (
          <Button
            className={styles.continueBtn}
            disabled={submitting}
            onClick={onDismiss}
          >
            Go to dashboard
            {submitting && <Loader2 size={16} className="animate-spin" />}
          </Button>
        ) : (
          <Button
            className={styles.continueBtn}
            disabled={!canProceed || submitting}
            onClick={onNext}
          >
            {isLastInputPhase ? "Finish setup" : "Continue"}
            {submitting && <Loader2 size={16} className="animate-spin" />}
          </Button>
        )}
      </div>
    </DialogFooter>
  );
};
