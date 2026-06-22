"use client";

// Next.js
import { useState } from "react";

// Hooks
import { useInquiryScheduling } from "@/hooks/useInquiryScheduling";
import { useRequestPayment } from "@/hooks/useRequestPayment";
import { useSlideTransition } from "@/hooks/useSlideTransition";
import { useArtistSettings } from "@/hooks/useArtistSettings";

// Libs
import { bookingsApi } from "@/lib/api/bookings";
import { paymentsApi } from "@/lib/api/payments";
import { useAuth } from "@/lib/auth";
import { displayToast } from "@/lib/toast";
import { TYPE_LABELS } from "@/constants/bookings";
import { getInquiryActionItems, getInquiryStatusMeta } from "@/lib/bookings";
import { formatRelativeDate } from "@/lib/formatters";

// Types
import type { SchedulePhase } from "@/hooks/useInquiryScheduling";
import type { RequestPaymentPhase } from "@/hooks/useRequestPayment";
import type {
  Inquiry,
  InquiryActionId,
  InquiryActionItem,
} from "@/types/bookings";

export type InquiryView = "details" | "actions" | "confirm";

const SUCCESS_TOAST: Partial<Record<InquiryActionId, string>> = {
  decline: "Booking declined",
  reopen: "Booking reopened",
  cancel: "Cancelled",
  refund: "Payment refunded",
};

const SCHEDULE_PHASE_INDEX: Record<SchedulePhase, number> = {
  length: 1,
  schedule: 2,
  review: 3,
};

const PAYMENT_PHASE_INDEX: Record<RequestPaymentPhase, number> = {
  type: 1,
  review: 2,
};

interface UseInquiryDetailViewParams {
  inquiry: Inquiry;
  setInquiry: (inquiry: Inquiry) => void;
  onActed: () => void;
  initialView: InquiryView;
}

export const useInquiryDetailView = ({
  inquiry,
  setInquiry,
  onActed,
  initialView,
}: UseInquiryDetailViewParams) => {
  const { token } = useAuth();
  const settings = useArtistSettings();

  const [view, setView] = useState<InquiryView>(initialView);
  const [pendingConfirm, setPendingConfirm] =
    useState<InquiryActionItem | null>(null);
  const [pendingActionKey, setPendingActionKey] = useState<string | null>(null);

  // Refetch the booking into the open sheet (payment creation doesn't return
  // it, so Details would otherwise miss the new request).
  const refreshInquiry = async () => {
    if (!token) return;
    try {
      setInquiry(await bookingsApi.get(token, inquiry.id));
    } catch {
      // Leave the current inquiry in place if the refetch fails.
    }
  };

  // Completing a scheduling or payment flow keeps the sheet open and returns to
  // Details so the artist sees the updated booking.
  const scheduling = useInquiryScheduling(
    inquiry,
    (updated) => {
      onActed();
      setInquiry(updated);
      setView("details");
    },
    settings.data?.settings.depositFlatFeeCents ?? null,
  );
  const payment = useRequestPayment(inquiry, () => {
    onActed();
    void refreshInquiry();
    setView("details");
  });

  const currency = settings.data?.settings.currency ?? "CAD";
  const feePayer = settings.data?.settings.platformFeePayer ?? "client";
  const actionItems = getInquiryActionItems(inquiry);
  const isDefaultView = !scheduling.appointmentType && !payment.isActive;

  const slideIndex = buildSlideIndex({ scheduling, payment, view });
  const slideRef = useSlideTransition<HTMLDivElement>(slideIndex);

  const openPaymentRequest = () => {
    if (settings.data && !settings.data.settings.stripeChargesEnabled) {
      displayToast(
        "Connect your Stripe account in Settings before requesting payments",
        "error",
      );
      return;
    }
    payment.open();
  };

  const execute = async (item: InquiryActionItem) => {
    if (!token) return;
    setPendingActionKey(item.key);
    try {
      let updated: Inquiry | null = null;
      if (item.id === "decline") {
        updated = await bookingsApi.decline(token, inquiry.id);
      } else if (item.id === "reopen") {
        updated = await bookingsApi.reopen(token, inquiry.id);
      } else if (item.id === "cancel") {
        updated = await bookingsApi.cancel(
          token,
          inquiry.id,
          item.appointmentId,
        );
      } else if (item.id === "refund" && item.paymentRequestId) {
        await paymentsApi.refundPaymentRequest(token, item.paymentRequestId);
        // The refund returns a payment request, not a booking; refetch the
        // inquiry so the sheet reflects the updated payment + deposit status.
        updated = await bookingsApi.get(token, inquiry.id);
      }
      if (updated) {
        displayToast(SUCCESS_TOAST[item.id] ?? "Done", "success");
        onActed();
        setInquiry(updated);
        // Reopening (undo) lands back on Actions since more actions may follow.
        // All other actions return to the Details phase to show the updated state.
        setView(item.id === "reopen" ? "actions" : "details");
      }
    } catch (err) {
      displayToast(
        err instanceof Error ? err.message : "Action failed",
        "error",
      );
    } finally {
      setPendingActionKey(null);
    }
  };

  const selectAction = (item: InquiryActionItem) => {
    if (pendingActionKey) return;
    if (item.id === "send_waiver") {
      displayToast("Coming soon", "info");
      return;
    }
    if (item.behavior === "confirm") {
      setPendingConfirm(item);
      setView("confirm");
      return;
    }
    if (item.behavior === "immediate") {
      void execute(item);
      return;
    }

    if (item.id === "accept") scheduling.openSchedule("session");
    else if (item.id === "book_consultation")
      scheduling.openSchedule("consultation");
    else if (item.id === "request_payment") openPaymentRequest();
    else if (item.id === "reschedule") {
      const appointment = inquiry.liveAppointments.find(
        (a) => a.id === item.appointmentId,
      );
      if (appointment) scheduling.openReschedule(appointment);
    }
  };

  const status = getInquiryStatusMeta(inquiry);
  const detailSub = buildDetailSub({ scheduling, payment, view, inquiry });

  return {
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
    showActions: () => setView("actions"),
    showDetails: () => setView("details"),
    cancelConfirm: () => {
      setView("actions");
      setPendingConfirm(null);
    },
  };
};

interface BuildSlideIndexParams {
  scheduling: ReturnType<typeof useInquiryScheduling>;
  payment: ReturnType<typeof useRequestPayment>;
  view: InquiryView;
}

function buildSlideIndex({
  scheduling,
  payment,
  view,
}: BuildSlideIndexParams): number {
  if (scheduling.appointmentType) return SCHEDULE_PHASE_INDEX[scheduling.phase];
  if (payment.isActive) return 4 + PAYMENT_PHASE_INDEX[payment.phase];
  if (view === "actions") return 7;
  if (view === "confirm") return 8;
  return 0;
}

interface BuildDetailSubParams {
  scheduling: ReturnType<typeof useInquiryScheduling>;
  payment: ReturnType<typeof useRequestPayment>;
  view: InquiryView;
  inquiry: Inquiry;
}

function buildDetailSub({
  scheduling,
  payment,
  view,
  inquiry,
}: BuildDetailSubParams): string {
  if (scheduling.appointmentType) {
    if (scheduling.isReschedule) return "Reschedule booking";
    if (scheduling.appointmentType === "consultation")
      return "Request a consultation";
    return "Accept & schedule";
  }

  if (payment.isActive) return "Request payment";
  if (view === "confirm") return "Confirm";
  if (view === "actions") return "Actions";

  return `${TYPE_LABELS[inquiry.type]} request · Submitted ${formatRelativeDate(inquiry.createdAt)}`;
}
