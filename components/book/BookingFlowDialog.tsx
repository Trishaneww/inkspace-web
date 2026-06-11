"use client";

// Next.js
import Image from "next/image";

// CSS
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Components
import { LocationPhase } from "./LocationPhase";
import { TattooPhase } from "./TattooPhase";
import { PlacementPhase } from "./PlacementPhase";
import { StylePhase } from "./StylePhase";
import { CustomQuestionsPhase } from "./CustomQuestionsPhase";
import { AvailabilityPhase } from "./AvailabilityPhase";
import { ContactPhase } from "./ContactPhase";
import { BookingSuccess } from "./BookingSuccess";
import { BookingFlowFooter } from "./BookingFlowFooter";

// Hooks
import { useBookingFlow } from "@/hooks/useBookingFlow";

// Libs
import { BOOKING_FLOW_PHASE_META } from "@/constants/bookingFlow";
import { BookingFlowPhase } from "@/types/bookingFlow";
import type {
  BookingFlowFormState,
  ReferenceUploadsController,
  UpdateBookingForm,
} from "@/types/bookingFlow";
import type { OpenBookProfile } from "@/types/bookings";

interface BookingFlowDialogProps {
  profile: OpenBookProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BookingFlowDialog = ({
  profile,
  open,
  onOpenChange,
}: BookingFlowDialogProps) => {
  const {
    phase,
    progress,
    succeeded,
    submitting,
    error,
    canProceed,
    isFirstPhase,
    isLastPhase,
    phaseContentRef,
    form,
    update,
    uploads,
    goNext,
    goBack,
    close,
  } = useBookingFlow(profile, onOpenChange);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) close();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className={styles.onboardingDialog}
      >
        <BookingFlowHeader progress={progress} />

        <div className={styles.content}>
          <div className={styles.phaseColumn} ref={phaseContentRef}>
            {succeeded ? (
              <BookingSuccess />
            ) : (
              <>
                <BookingFlowHeading phase={phase} />
                <div className={styles.fields}>
                  <PhaseContent
                    phase={phase}
                    form={form}
                    update={update}
                    uploads={uploads}
                    profile={profile}
                  />
                </div>
                {error && <p className={styles.error}>{error}</p>}
              </>
            )}
          </div>
        </div>

        <BookingFlowFooter
          succeeded={succeeded}
          submitting={submitting}
          canProceed={canProceed}
          isFirstPhase={isFirstPhase}
          isLastPhase={isLastPhase}
          onNext={goNext}
          onBack={goBack}
          onClose={close}
        />
      </DialogContent>
    </Dialog>
  );
};

const BookingFlowHeader = ({ progress }: { progress: number }) => {
  return (
    <div className={styles.topbar}>
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
    </div>
  );
};

const BookingFlowHeading = ({ phase }: { phase: BookingFlowPhase }) => {
  const { lead, rest } = BOOKING_FLOW_PHASE_META[phase];

  return (
    <DialogTitle className={styles.heading}>
      <span className={styles.headingLead}>{lead}</span> {rest}
    </DialogTitle>
  );
};

interface PhaseContentProps {
  phase: BookingFlowPhase;
  form: BookingFlowFormState;
  update: UpdateBookingForm;
  uploads: ReferenceUploadsController;
  profile: OpenBookProfile;
}

const PhaseContent = ({
  phase,
  form,
  update,
  uploads,
  profile,
}: PhaseContentProps) => {
  switch (phase) {
    case BookingFlowPhase.Location:
      return (
        <LocationPhase
          form={form}
          update={update}
          locations={profile.locations}
        />
      );
    case BookingFlowPhase.Tattoo:
      return <TattooPhase form={form} update={update} uploads={uploads} />;
    case BookingFlowPhase.Placement:
      return <PlacementPhase form={form} update={update} />;
    case BookingFlowPhase.Style:
      return <StylePhase form={form} update={update} styles={profile.styles} />;
    case BookingFlowPhase.CustomQuestions:
      return (
        <CustomQuestionsPhase
          form={form}
          update={update}
          questions={profile.customQuestions}
        />
      );
    case BookingFlowPhase.Availability:
      return (
        <AvailabilityPhase
          form={form}
          update={update}
          availability={profile.availability}
        />
      );
    case BookingFlowPhase.Contact:
      return <ContactPhase form={form} update={update} />;
    default:
      return null;
  }
};
