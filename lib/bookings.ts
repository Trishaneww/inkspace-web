// Libs
import { format } from "date-fns";
import {
  COLOR_TYPE_LABELS,
  INQUIRY_ACTIONS,
  PAYMENT_TYPE_LABELS,
  STATUS_META,
} from "@/constants/bookings";
import { FLASH_SIZE_LABELS } from "@/constants/flashes";
import { formatPrice } from "@/lib/formatters";

// Types
import type {
  Appointment,
  BadgeMeta,
  BookingFilters,
  Inquiry,
  InquiryActionId,
  InquiryActionItem,
  InquiryPayment,
  RecencyFilter,
} from "@/types/bookings";

export function getInquiryStatusMeta(inquiry: Inquiry): BadgeMeta {
  if (
    inquiry.status === "accepted" &&
    inquiry.appointment?.status === "proposed"
  ) {
    return { label: "Proposed", variant: "pending" };
  }
  return STATUS_META[inquiry.status];
}

const RECENCY_WINDOW_DAYS: Record<Exclude<RecencyFilter, "all">, number> = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
};

export function filterInquiries(
  inquiries: Inquiry[],
  filters: BookingFilters,
): Inquiry[] {
  const query = filters.search.trim().toLowerCase();
  const matched = inquiries.filter((inquiry) => {
    if (filters.status !== "all" && inquiry.status !== filters.status) {
      return false;
    }
    if (filters.recency !== "all") {
      const submitted = new Date(inquiry.createdAt).getTime();
      const windowMs = RECENCY_WINDOW_DAYS[filters.recency] * 86_400_000;
      if (Number.isNaN(submitted) || Date.now() - submitted > windowMs) {
        return false;
      }
    }
    if (
      query &&
      !inquiry.clientName.toLowerCase().includes(query) &&
      !inquiry.clientEmail.toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });

  return matched.sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return filters.sort === "oldest" ? aTime - bTime : bTime - aTime;
  });
}

export function hasActiveBookingFilters(filters: BookingFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.recency !== "all" ||
    filters.sort !== "newest"
  );
}

export function getInquiryActionItems(inquiry: Inquiry): InquiryActionItem[] {
  const items: InquiryActionItem[] = [];

  for (const action of INQUIRY_ACTIONS) {
    if (!action.isAvailable(inquiry)) continue;

    if (action.perAppointment) {
      const actionLabel = action.id === "reschedule" ? "Reschedule" : "Cancel";
      const appointments = getAppointmentsForAction(action.id, inquiry);
      for (const appt of appointments) {
        items.push({
          key: `${action.id}:${appt.id}`,
          id: action.id,
          label: `${actionLabel} ${formatAppointmentType(appt)}`,
          description: formatAppointmentTime(appt),
          icon: action.icon,
          behavior: action.behavior,
          destructive: action.destructive ?? false,
          appointmentId: appt.id,
          confirmMessage: action.confirmMessage,
        });
      }
      continue;
    }

    if (action.perPayment) {
      const refundablePayments = getRefundablePayments(inquiry);
      for (const payment of refundablePayments) {
        const amount = formatPrice(payment.clientChargeCents, payment.currency);
        items.push({
          key: `${action.id}:${payment.id}`,
          id: action.id,
          label: `Refund ${formatPaymentType(payment)}`,
          description: `${amount} paid`,
          icon: action.icon,
          behavior: action.behavior,
          destructive: action.destructive ?? false,
          paymentRequestId: payment.id,
          confirmMessage: `Refund ${amount} to the client? This can't be undone.`,
        });
      }
      continue;
    }

    items.push({
      key: action.id,
      id: action.id,
      label:
        typeof action.label === "function"
          ? action.label(inquiry)
          : action.label,
      description: action.description,
      icon: action.icon,
      behavior: action.behavior,
      destructive: action.destructive ?? false,
      confirmMessage: action.confirmMessage,
    });
  }

  return items.sort((a, b) => Number(a.destructive) - Number(b.destructive));
}

function getAppointmentsForAction(
  actionId: InquiryActionId,
  inquiry: Inquiry,
): Appointment[] {
  const live = inquiry.liveAppointments ?? [];
  if (actionId === "reschedule") {
    return live.filter((a) => a.scheduledStart && a.status === "scheduled");
  }
  return live;
}

function formatAppointmentType(appt: Appointment): string {
  return appt.type === "consultation" ? "consultation" : "session";
}

function getRefundablePayments(inquiry: Inquiry): InquiryPayment[] {
  return (inquiry.payments ?? []).filter((p) => p.status === "paid");
}

function formatPaymentType(payment: InquiryPayment): string {
  return (PAYMENT_TYPE_LABELS[payment.type] ?? "payment").toLowerCase();
}

function formatAppointmentTime(appt: Appointment): string {
  if (!appt.scheduledStart) return "Awaiting a time";
  return format(new Date(appt.scheduledStart), "MMM d, h:mm a");
}

export function requestMeta(inquiry: Inquiry): string {
  const parts: string[] = [];
  if (inquiry.placement) parts.push(inquiry.placement);
  if (inquiry.approxSizeInches) parts.push(`${inquiry.approxSizeInches}"`);
  return parts.join(" · ") || "—";
}

export function describePiece(inquiry: Inquiry): string {
  if (inquiry.flash) {
    const size = inquiry.flash.sizeCode
      ? (FLASH_SIZE_LABELS[inquiry.flash.sizeCode] ?? inquiry.flash.sizeCode)
      : null;
    return [inquiry.flash.title, size].filter(Boolean).join(" · ");
  }
  const parts = [
    inquiry.placement,
    inquiry.approxSizeInches != null ? `${inquiry.approxSizeInches}"` : null,
    COLOR_TYPE_LABELS[inquiry.colorType] ?? inquiry.colorType,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : "Custom piece";
}
