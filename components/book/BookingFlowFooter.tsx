"use client";

// CSS
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

interface BookingFlowFooterProps {
  isCompleted: boolean;
  submitting: boolean;
  canProceed: boolean;
  isFirstPhase: boolean;
  primaryLabel: string | null;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}

export const BookingFlowFooter = ({
  isCompleted,
  submitting,
  canProceed,
  isFirstPhase,
  primaryLabel,
  onNext,
  onBack,
  onClose,
}: BookingFlowFooterProps) => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerLeft}>
        {!isCompleted && (
          <Button
            type="button"
            className={styles.backLink}
            disabled={submitting}
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            {isFirstPhase ? "Cancel" : "Back"}
          </Button>
        )}
      </div>
      <div className={styles.footerRight}>
        {isCompleted ? (
          <Button className={styles.continueBtn} onClick={onClose}>
            Done
          </Button>
        ) : (
          primaryLabel && (
            <Button
              className={styles.continueBtn}
              disabled={!canProceed}
              onClick={onNext}
            >
              {primaryLabel}
              {submitting && <Loader2 size={16} className="animate-spin" />}
            </Button>
          )
        )}
      </div>
    </div>
  );
};
