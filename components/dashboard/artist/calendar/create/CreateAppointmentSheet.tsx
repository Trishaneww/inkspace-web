"use client";

// CSS
import styles from "@/styles/dashboard/artist/CreateAppointment.module.css";

// HTML Components
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

// Components
import { ApptTypePhase } from "./ApptTypePhase";
import { ApptClientPhase } from "./ApptClientPhase";
import { ApptSchedulePhase } from "./ApptSchedulePhase";
import { ApptReviewPhase } from "./ApptReviewPhase";

// Hooks
import { useCreateAppointment } from "@/hooks/useCreateAppointment";
import { useSlideTransition } from "@/hooks/useSlideTransition";
import { useArtistSettings } from "@/hooks/useArtistSettings";

// Libs
import { CREATE_APPOINTMENT_PHASE_META } from "@/constants/calendar";
import { CreateAppointmentPhase } from "@/types/calendar";

// Types
import type { OpenBookAvailabilityWindow } from "@/types/bookings";
import type { Location } from "@/types/settings";

interface CreateAppointmentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export const CreateAppointmentSheet = ({
  open,
  onOpenChange,
  onCreated,
}: CreateAppointmentSheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent side="right" className={styles.sheet} showCloseButton>
      {open && <CreateAppointmentLoader onCreated={onCreated} />}
    </SheetContent>
  </Sheet>
);

const CreateAppointmentLoader = ({ onCreated }: { onCreated: () => void }) => {
  const settings = useArtistSettings();
  if (!settings.data) {
    return <div className={styles.loadingState}>Loading…</div>;
  }

  const { locations, availability } = settings.data;
  const defaultLocationId =
    locations.find((l) => l.isPrimary)?.id ?? locations[0]?.id ?? "";

  return (
    <CreateAppointmentContent
      onCreated={onCreated}
      locations={locations}
      availability={availability}
      defaultLocationId={defaultLocationId}
    />
  );
};

interface CreateAppointmentContentProps {
  onCreated: () => void;
  locations: Location[];
  availability: OpenBookAvailabilityWindow[];
  defaultLocationId: string;
}

const CreateAppointmentContent = ({
  onCreated,
  locations,
  availability,
  defaultLocationId,
}: CreateAppointmentContentProps) => {
  const create = useCreateAppointment(onCreated, defaultLocationId);
  const slideRef = useSlideTransition<HTMLDivElement>(create.phaseIndex);
  const meta = CREATE_APPOINTMENT_PHASE_META[create.phase];

  const renderPhase = () => {
    switch (create.phase) {
      case CreateAppointmentPhase.Type:
        return (
          <ApptTypePhase
            form={create.form}
            selectType={create.selectType}
            update={create.update}
          />
        );
      case CreateAppointmentPhase.Client:
        return <ApptClientPhase form={create.form} update={create.update} />;
      case CreateAppointmentPhase.Schedule:
        return (
          <ApptSchedulePhase
            form={create.form}
            update={create.update}
            locations={locations}
            availability={availability}
          />
        );
      case CreateAppointmentPhase.Review:
        return <ApptReviewPhase form={create.form} locations={locations} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.header}>
        <SheetTitle className={styles.title}>{meta.lead}</SheetTitle>
        <p className={styles.sub}>{meta.rest}</p>
      </div>

      <div ref={slideRef} className={styles.slide}>
        {renderPhase()}
        {create.error && <p className={styles.error}>{create.error}</p>}
      </div>

      <div className={styles.footer}>
        {create.phaseIndex > 0 && (
          <Button
            type="button"
            variant="outline"
            disabled={create.submitting}
            onClick={create.back}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        )}
        <Button
          type="button"
          className={styles.primary}
          disabled={!create.canProceed || create.submitting}
          onClick={create.next}
        >
          {create.isLastPhase ? "Create booking" : "Continue"}
          {create.submitting && <Loader2 size={16} className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
};
