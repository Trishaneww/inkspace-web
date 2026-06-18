// Libs
import type { ClientInquiry, InquiryPayment } from "@/types/bookings";

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