"use client";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

// Components
import { StatusBadge } from "./StatusBadge";
import { InquiryDetailsPhase } from "./InquiryDetailsPhase";
import { InquiryConsultLengthPhase } from "./InquiryConsultLengthPhase";
import { InquirySchedulePhase } from "./InquirySchedulePhase";
import { InquiryReviewPhase } from "./InquiryReviewPhase";

// Hooks
import { useInquiryScheduling } from "@/hooks/useInquiryScheduling";
import type { SchedulePhase } from "@/hooks/useInquiryScheduling";
import { useSlideTransition } from "@/hooks/useSlideTransition";

// Libs
import { bookingsApi } from "@/lib/api/bookings";
import { useAuth } from "@/lib/auth";
import { displayToast } from "@/lib/toast";
import { TYPE_LABELS } from "@/constants/bookings";
import {
  formatRelativeDate,
  getInquiryActions,
  getInquiryStatusMeta,
} from "@/lib/bookings";
import type { Inquiry, InquiryAction, InquiryActionId } from "@/types/bookings";

interface InquiryDetailViewProps {
  inquiry: Inquiry;
  setInquiry: (inquiry: Inquiry) => void;
  onActed: () => void;
  actingId: InquiryActionId | null;
  setActingId: (id: InquiryActionId | null) => void;
}

export const InquiryDetailView = ({
  inquiry,
  setInquiry,
  onActed,
  actingId,
  setActingId,
}: InquiryDetailViewProps) => {
  const { token } = useAuth();

  const scheduling = useInquiryScheduling(inquiry, (updated) => {
    setInquiry(updated);
    onActed();
  });
  const { appointmentType, phase, openSchedule, openReschedule } = scheduling;
  const slideIndex = appointmentType ? SCHEDULE_PHASE_INDEX[phase] : 0;
  const slideRef = useSlideTransition<HTMLDivElement>(slideIndex);

  const runAction = async (action: InquiryActionId) => {
    if (!token) return;
    if (action === "accept") return openSchedule("session");
    if (action === "book_consultation") return openSchedule("consultation");
    if (action === "reschedule") return openReschedule();

    setActingId(action);
    try {
      if (action === "decline") {
        setInquiry(await bookingsApi.decline(token, inquiry.id));
        displayToast("Booking declined", "success");
        onActed();
      } else if (action === "reopen") {
        setInquiry(await bookingsApi.reopen(token, inquiry.id));
        displayToast("Booking reopened", "success");
        onActed();
      } else {
        displayToast("Coming soon", "info");
      }
    } catch (err) {
      displayToast(
        err instanceof Error ? err.message : "Action failed",
        "error",
      );
    } finally {
      setActingId(null);
    }
  };

  const status = getInquiryStatusMeta(inquiry);

  return (
    <div className={styles.editForm}>
      <div className={styles.detailHeader}>
        <div className={styles.detailTitleRow}>
          <SheetTitle className={styles.detailTitle}>
            {inquiry.clientName}
          </SheetTitle>
          <StatusBadge label={status.label} variant={status.variant} />
        </div>
        <span className={styles.detailSub}>
          {scheduling.isReschedule
            ? "Reschedule appointment"
            : appointmentType === "consultation"
              ? "Request a consultation"
              : appointmentType === "session"
                ? "Accept & schedule"
                : `${TYPE_LABELS[inquiry.type]} request · Submitted ${formatRelativeDate(inquiry.createdAt)}`}
        </span>
      </div>

      <div ref={slideRef} className={styles.phaseSlide}>
        {!appointmentType ? (
          <InquiryDetailsPhase inquiry={inquiry} />
        ) : phase === "length" ? (
          <InquiryConsultLengthPhase
            selected={scheduling.form.consultationDurationMinutes}
            onSelect={scheduling.selectLength}
          />
        ) : phase === "review" ? (
          <>
            <InquiryReviewPhase
              inquiry={inquiry}
              type={appointmentType}
              form={scheduling.form}
            />
            {scheduling.error && (
              <p className={styles.editError}>{scheduling.error}</p>
            )}
          </>
        ) : (
          <InquirySchedulePhase
            inquiry={inquiry}
            type={appointmentType}
            form={scheduling.form}
            update={scheduling.update}
            isReschedule={scheduling.isReschedule}
          />
        )}
      </div>

      {!appointmentType ? (
        <InquirySheetFooter
          actions={getInquiryActions(inquiry)}
          actingId={actingId}
          onAction={runAction}
        />
      ) : phase === "length" ? (
        <ScheduleFooter onBack={scheduling.back} />
      ) : phase === "review" ? (
        <ScheduleFooter
          primaryLabel={scheduling.primaryLabel}
          canSubmit={scheduling.canSubmit}
          submitting={scheduling.submitting}
          onBack={scheduling.back}
          onSubmit={scheduling.submit}
        />
      ) : (
        <ScheduleFooter
          primaryLabel="Review"
          canSubmit={scheduling.canSubmit}
          onBack={scheduling.back}
          onSubmit={scheduling.goToReview}
        />
      )}
    </div>
  );
};

const SCHEDULE_PHASE_INDEX: Record<SchedulePhase, number> = {
  length: 1,
  schedule: 2,
  review: 3,
};

interface InquirySheetFooterProps {
  actions: InquiryAction[];
  actingId: InquiryActionId | null;
  onAction: (action: InquiryActionId) => void;
}

const InquirySheetFooter = ({
  actions,
  actingId,
  onAction,
}: InquirySheetFooterProps) => {
  if (actions.length === 0) return null;

  return (
    <div className={styles.editFooter}>
      {actions.map((action) => {
        return (
          <Button
            key={action.id}
            type="button"
            variant={action.destructive ? "destructive" : "outline"}
            disabled={actingId !== null}
            onClick={() => onAction(action.id)}
          >
            <action.icon size={16} className={styles.actionBtnIcon} />
            {action.label}
            {actingId === action.id && (
              <Loader2 size={16} className="animate-spin" />
            )}
          </Button>
        );
      })}
    </div>
  );
};

interface ScheduleFooterProps {
  primaryLabel?: string;
  canSubmit?: boolean;
  submitting?: boolean;
  onBack: () => void;
  onSubmit?: () => void;
}

const ScheduleFooter = ({
  primaryLabel,
  canSubmit = true,
  submitting = false,
  onBack,
  onSubmit,
}: ScheduleFooterProps) => (
  <div className={styles.scheduleFooter}>
    <Button
      type="button"
      variant="outline"
      disabled={submitting}
      onClick={onBack}
    >
      <ArrowLeft size={16} className={styles.actionBtnIcon} />
      Back
    </Button>
    {primaryLabel && onSubmit && (
      <Button
        type="button"
        className={styles.saveBtn}
        disabled={!canSubmit || submitting}
        onClick={onSubmit}
      >
        {primaryLabel}
        {submitting && <Loader2 size={16} className="animate-spin" />}
      </Button>
    )}
  </div>
);
