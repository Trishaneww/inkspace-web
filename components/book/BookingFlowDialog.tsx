"use client";

// Next.js
import Image from "next/image";

// CSS
import clsx from "clsx";
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Components
import { BookingTrackPhase } from "./BookingTrackPhase";
import { LocationPhase } from "./LocationPhase";
import { TattooPhase } from "./TattooPhase";
import { PlacementPhase } from "./PlacementPhase";
import { StylePhase } from "./StylePhase";
import { CustomQuestionsPhase } from "./CustomQuestionsPhase";
import { AvailabilityPhase } from "./AvailabilityPhase";
import { FlashGridPhase } from "./FlashGridPhase";
import { FlashDetailPhase } from "./FlashDetailPhase";
import { ContactPhase } from "./ContactPhase";
import { BookingSuccess } from "./BookingSuccess";
import { BookingFlowFooter } from "./BookingFlowFooter";

// Hooks
import { useBookingFlow } from "@/hooks/useBookingFlow";

// Libs
import { OpenBookThemeContext } from "@/lib/openBookTheme";
import { buildCustomThemeStyle } from "@/lib/openBookThemeStyle";
import { BOOKING_FLOW_PHASE_META } from "@/constants/bookingFlow";
import { BookingFlowPhase } from "@/types/bookingFlow";
import type {
  BookingFlowEntry,
  BookingFlowFormState,
  BookingFlowTrack,
  ReferenceUploadsController,
  UpdateBookingForm,
} from "@/types/bookingFlow";
import type { OpenBookProfile } from "@/types/bookings";
import type { Flash } from "@/types/flash";

interface BookingFlowDialogProps {
  profile: OpenBookProfile;
  entry: BookingFlowEntry;
  onOpenChange: (open: boolean) => void;
}

export const BookingFlowDialog = ({
  profile,
  entry,
  onOpenChange,
}: BookingFlowDialogProps) => {
  const {
    phase,
    track,
    showProgress,
    progress,
    isCompleted,
    submitting,
    error,
    canProceed,
    isFirstPhase,
    primaryLabel,
    phaseContentRef,
    form,
    update,
    uploads,
    flashes,
    flashesLoading,
    flashesError,
    selectedFlash,
    selectFlash,
    selectTrack,
    goNext,
    goBack,
    close,
  } = useBookingFlow(profile, entry, onOpenChange);

  const customStyle =
    profile.theme === "custom" && profile.customTheme
      ? buildCustomThemeStyle(profile.customTheme)
      : undefined;

  return (
    <OpenBookThemeContext.Provider
      value={{ theme: profile.theme, customStyle }}
    >
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) close();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className={styles.onboardingDialog}
        data-ob-theme={profile.theme}
        style={customStyle}
      >
        <BookingFlowHeader progress={progress} showProgress={showProgress} />

        <div className={styles.content}>
          <div
            className={clsx(styles.phaseColumn, {
              [styles.fullWidth]:
                phase === BookingFlowPhase.FlashGrid ||
                phase === BookingFlowPhase.FlashDetail,
            })}
            ref={phaseContentRef}
          >
            {!isCompleted && phase !== BookingFlowPhase.FlashDetail && (
              <BookingFlowHeading phase={phase} />
            )}
            <div className={styles.fields}>
              <PhaseContent
                phase={phase}
                track={track}
                form={form}
                update={update}
                uploads={uploads}
                profile={profile}
                flashes={flashes}
                flashesLoading={flashesLoading}
                flashesError={flashesError}
                selectedFlash={selectedFlash}
                onSelectFlash={selectFlash}
                onSelectTrack={selectTrack}
              />
            </div>
            {!isCompleted && error && <p className={styles.error}>{error}</p>}
          </div>
        </div>

        <BookingFlowFooter
          isCompleted={isCompleted}
          submitting={submitting}
          canProceed={canProceed}
          isFirstPhase={isFirstPhase}
          primaryLabel={primaryLabel}
          onNext={goNext}
          onBack={goBack}
          onClose={close}
        />
      </DialogContent>
    </Dialog>
    </OpenBookThemeContext.Provider>
  );
};

interface PhaseContentProps {
  phase: BookingFlowPhase;
  track: BookingFlowTrack;
  form: BookingFlowFormState;
  update: UpdateBookingForm;
  uploads: ReferenceUploadsController;
  profile: OpenBookProfile;
  flashes: Flash[];
  flashesLoading: boolean;
  flashesError: string | null;
  selectedFlash: Flash | null;
  onSelectFlash: (flashId: string) => void;
  onSelectTrack: (track: BookingFlowTrack) => void;
}

const PhaseContent = ({
  phase,
  track,
  form,
  update,
  uploads,
  profile,
  flashes,
  flashesLoading,
  flashesError,
  selectedFlash,
  onSelectFlash,
  onSelectTrack,
}: PhaseContentProps) => {
  switch (phase) {
    case BookingFlowPhase.BookingTrack:
      return <BookingTrackPhase track={track} onSelect={onSelectTrack} />;
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
      return <StylePhase form={form} update={update} />;
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
    case BookingFlowPhase.FlashGrid:
      return (
        <FlashGridPhase
          flashes={flashes}
          loading={flashesLoading}
          error={flashesError}
          selectedId={form.flashId}
          onSelect={onSelectFlash}
        />
      );
    case BookingFlowPhase.FlashDetail:
      return selectedFlash ? (
        <FlashDetailPhase
          flash={selectedFlash}
          form={form}
          update={update}
          locations={profile.locations}
        />
      ) : null;
    case BookingFlowPhase.Contact:
      return <ContactPhase form={form} update={update} />;
    case BookingFlowPhase.Completed:
      return <BookingSuccess />;
    default:
      return null;
  }
};

const BookingFlowHeader = ({
  progress,
  showProgress,
}: {
  progress: number;
  showProgress: boolean;
}) => {
  return (
    <div className={styles.topbar}>
      <Image
        src="/logos/inkspace-logo.svg"
        alt="Inkspace"
        width={40}
        height={40}
        className={styles.logo}
      />
      {showProgress && (
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
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
