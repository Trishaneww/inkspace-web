// Libs
import type { ClientInquiry, Inquiry, InquiryPayment } from "@/types/bookings";

export function isAwaitingSchedule(inquiry: Inquiry): boolean {
  const appointment = inquiry.appointment;
  return (
    !!appointment &&
    appointment.status === "proposed" &&
    !appointment.scheduledStart
  );
}

export function findPayablePayment(
  inquiry: ClientInquiry,
): InquiryPayment | null {
  return (
    inquiry.payments.find((payment) => payment.status === "requested") ?? null
  );
}

export function findLatestPayment(
  inquiry: ClientInquiry,
): InquiryPayment | null {
  return inquiry.payments[0] ?? null;
}
