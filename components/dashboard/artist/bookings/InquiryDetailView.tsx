"use client";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Zap } from "lucide-react";

// Components
import { StatusBadge } from "./StatusBadge";
import { InquiryDetailsPhase } from "./InquiryDetailsPhase";
import { InquiryConsultLengthPhase } from "./InquiryConsultLengthPhase";
import { InquirySchedulePhase } from "./InquirySchedulePhase";
import { InquiryReviewPhase } from "./InquiryReviewPhase";
import { RequestPaymentTypePhase } from "./RequestPaymentTypePhase";
import { RequestPaymentReviewPhase } from "./RequestPaymentReviewPhase";
import { InquiryActionsPhase } from "./InquiryActionsPhase";
import { InquiryConfirmPhase } from "./InquiryConfirmPhase";

// Hooks
import { useInquiryDetailView } from "@/hooks/useInquiryDetailView";

// Types
import type { InquiryView } from "@/hooks/useInquiryDetailView";
import type { Inquiry } from "@/types/bookings";

interface InquiryDetailViewProps {
  inquiry: Inquiry;
  setInquiry: (inquiry: Inquiry) => void;
  onActed: () => void;
  onClose: () => void;
  initialView?: InquiryView;
}

export const InquiryDetailView = ({
  inquiry,
  setInquiry,
  onActed,
  onClose,
  initialView = "details",
}: InquiryDetailViewProps) => {
  const {
    scheduling,
    payment,
    view,
    pendingConfirm,
    pendingActionKey,
    isDefaultView,
    slideRef,
    status,
    detailSub,
    currency,
    feePayer,
    actionItems,
    selectAction,
    execute,
    showActions,
    showDetails,
    cancelConfirm,
  } = useInquiryDetailView({
    inquiry,
    setInquiry,
    onActed,
    initialView,
  });

  const { appointmentType, phase } = scheduling;

  return (
    <div className={styles.editForm}>
      <div className={styles.detailHeader}>
        <div className={styles.detailTitleRow}>
          <SheetTitle className={styles.detailTitle}>
            {inquiry.clientName}
          </SheetTitle>
          <StatusBadge label={status.label} variant={status.variant} />
        </div>
        <span className={styles.detailSub}>{detailSub}</span>
      </div>

      <div ref={slideRef} className={styles.phaseSlide}>
        {appointmentType &&
          (phase === "length" ? (
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
                isReschedule={scheduling.isReschedule}
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
          ))}

        {payment.isActive &&
          (payment.phase === "review" ? (
            <>
              <RequestPaymentReviewPhase
                inquiry={inquiry}
                form={payment.form}
                currency={currency}
                feePayer={feePayer}
              />
              {payment.error && (
                <p className={styles.editError}>{payment.error}</p>
              )}
            </>
          ) : (
            <RequestPaymentTypePhase
              form={payment.form}
              currency={currency}
              selectType={payment.selectType}
              update={payment.update}
            />
          ))}

        {isDefaultView && view === "details" && (
          <InquiryDetailsPhase inquiry={inquiry} />
        )}
        {isDefaultView && view === "actions" && (
          <InquiryActionsPhase
            items={actionItems}
            pendingActionKey={pendingActionKey}
            onSelect={selectAction}
          />
        )}
        {isDefaultView && view === "confirm" && pendingConfirm && (
          <InquiryConfirmPhase item={pendingConfirm} />
        )}
      </div>

      {appointmentType &&
        (phase === "length" ? (
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
        ))}

      {payment.isActive &&
        (payment.phase === "review" ? (
          <ScheduleFooter
            primaryLabel="Request payment"
            canSubmit={payment.canSubmit}
            submitting={payment.submitting}
            onBack={payment.back}
            onSubmit={payment.submit}
          />
        ) : (
          <ScheduleFooter
            primaryLabel="Review"
            canSubmit={payment.canSubmit}
            onBack={payment.back}
            onSubmit={payment.goToReview}
          />
        ))}

      {isDefaultView && view === "details" && (
        <DetailsFooter
          hasActions={actionItems.length > 0}
          onClose={onClose}
          onActions={showActions}
        />
      )}
      {isDefaultView && view === "actions" && (
        <ScheduleFooter onBack={showDetails} />
      )}
      {isDefaultView && view === "confirm" && pendingConfirm && (
        <ScheduleFooter
          destructive={pendingConfirm.destructive}
          primaryLabel="Confirm"
          submitting={pendingActionKey === pendingConfirm.key}
          onBack={cancelConfirm}
          onSubmit={() => execute(pendingConfirm)}
        />
      )}
    </div>
  );
};

const DetailsFooter = ({
  hasActions,
  onClose,
  onActions,
}: {
  hasActions: boolean;
  onClose: () => void;
  onActions: () => void;
}) => (
  <div className={styles.scheduleFooter}>
    <Button type="button" variant="outline" onClick={onClose}>
      Close
    </Button>
    <Button
      type="button"
      className={styles.saveBtn}
      disabled={!hasActions}
      onClick={onActions}
    >
      <Zap size={16} />
      Actions
    </Button>
  </div>
);

interface ScheduleFooterProps {
  primaryLabel?: string;
  canSubmit?: boolean;
  submitting?: boolean;
  destructive?: boolean;
  onBack: () => void;
  onSubmit?: () => void;
}

const ScheduleFooter = ({
  primaryLabel,
  canSubmit = true,
  submitting = false,
  destructive = false,
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
        variant={destructive ? "destructive" : "default"}
        className={destructive ? undefined : styles.saveBtn}
        disabled={!canSubmit || submitting}
        onClick={onSubmit}
      >
        {primaryLabel}
        {submitting && <Loader2 size={16} className="animate-spin" />}
      </Button>
    )}
  </div>
);
