"use client";

// Next.js
import Image from "next/image";

// CSS
import clsx from "clsx";
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Components
import { ProfilePhase } from "./ProfilePhase";
import { StudioPhase } from "./StudioPhase";
import { AvailabilityPhase } from "./AvailabilityPhase";
import { StylesPhase } from "./StylesPhase";
import { BookingsPhase } from "./BookingsPhase";
import { CompletedPhase } from "./CompletedPhase";
import { OnboardingDialogFooter } from "./OnboardingDialogFooter";

// Hooks
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { useSlideTransition } from "@/hooks/useSlideTransition";

// Libs
import { ONBOARDING_PHASE_META } from "@/constants/onboarding";
import { OnboardingPhase } from "@/types/onboarding";

export const OnboardingDialog = () => {
  const {
    phase,
    progress,
    form,
    update,
    usernameStatus,
    canProceed,
    submitting,
    formError,
    onNext,
    onBack,
    onDismiss,
  } = useOnboardingForm();

  const renderPhaseContent = () => {
    switch (phase) {
      case OnboardingPhase.Profile:
        return (
          <ProfilePhase
            form={form}
            update={update}
            usernameStatus={usernameStatus}
          />
        );
      case OnboardingPhase.Studio:
        return <StudioPhase form={form} update={update} />;
      case OnboardingPhase.Availability:
        return <AvailabilityPhase form={form} update={update} />;
      case OnboardingPhase.Styles:
        return <StylesPhase form={form} update={update} />;
      case OnboardingPhase.Bookings:
        return <BookingsPhase form={form} update={update} />;
      case OnboardingPhase.Complete:
        return <CompletedPhase />;
      default:
        return null;
    }
  };

  const phaseContentRef = useSlideTransition(phase);

  return (
    <Dialog open onOpenChange={() => {}} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className={styles.onboardingDialog}
      >
        <OnboardingHeader progress={progress} />
        <OnboardingContent
          phase={phase}
          phaseContentRef={phaseContentRef}
          renderPhaseContent={renderPhaseContent}
          formError={formError}
        />
        <OnboardingDialogFooter
          phase={phase}
          submitting={submitting}
          canProceed={canProceed}
          onNext={onNext}
          onBack={onBack}
          onDismiss={onDismiss}
        />
      </DialogContent>
    </Dialog>
  );
};

const OnboardingHeader = ({ progress }: { progress: number }) => {
  return (
    <DialogHeader className={styles.topbar}>
      <Image
        src="/logos/inkspace-logo.svg"
        alt="Inkspace"
        width={40}
        height={40}
        className={styles.logo}
      />
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </DialogHeader>
  );
};

interface OnboardingContentProps {
  phase: OnboardingPhase;
  phaseContentRef: React.RefObject<HTMLDivElement | null>;
  renderPhaseContent: () => React.ReactNode;
  formError: string | null;
}

const OnboardingContent = ({
  phase,
  phaseContentRef,
  renderPhaseContent,
  formError,
}: OnboardingContentProps) => {
  const isComplete = phase === OnboardingPhase.Complete;

  return (
    <div className={styles.content}>
      <div
        className={clsx(styles.phaseColumn, {
          [styles.fullWidth]: isComplete,
        })}
        ref={phaseContentRef}
      >
        <DialogTitle className={styles.heading}>
          <span className={styles.headingLead}>
            {ONBOARDING_PHASE_META[phase].lead}
          </span>{" "}
          {ONBOARDING_PHASE_META[phase].rest}
        </DialogTitle>

        <div className={styles.fields}>{renderPhaseContent()}</div>

        {!isComplete && formError && (
          <p className={styles.error}>{formError}</p>
        )}
        {!isComplete && (
          <p className={styles.reassure}>
            You can change any of this later in Settings.
          </p>
        )}
      </div>
    </div>
  );
};
