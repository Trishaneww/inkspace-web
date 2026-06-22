// Libs
import { PAYABLE_PAYMENT_STATUSES } from "@/constants/payments";
import type { ClientInquiry, Inquiry, InquiryPayment } from "@/types/bookings";

export interface ClientPaymentBreakdown {
  title: string;
  totalCents: number;
  depositPaidCents: number;
  currency: string;
}

export function getClientPaymentBreakdown(
  inquiry: Inquiry,
  payment: InquiryPayment,
): ClientPaymentBreakdown {
  if (payment.type === "deposit") {
    return {
      title: "Deposit",
      totalCents: payment.clientChargeCents,
      depositPaidCents: 0,
      currency: payment.currency,
    };
  }

  const paidDeposit = inquiry.payments.find(
    (p) => p.type === "deposit" && p.status === "paid",
  );
  return {
    title: "Balance",
    totalCents: payment.clientChargeCents,
    depositPaidCents: paidDeposit ? paidDeposit.clientChargeCents : 0,
    currency: payment.currency,
  };
}

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
    inquiry.payments.find((payment) =>
      PAYABLE_PAYMENT_STATUSES.has(payment.status),
    ) ?? null
  );
}

export function findLatestPayment(
  inquiry: ClientInquiry,
): InquiryPayment | null {
  return inquiry.payments[0] ?? null;
}

export function needsClientAction(inquiry: ClientInquiry): boolean {
  return isAwaitingSchedule(inquiry) || findPayablePayment(inquiry) !== null;
}
