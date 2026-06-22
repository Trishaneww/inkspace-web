// Libs
import type { PaymentType, PaymentRequestStatus } from "@/types/bookings";

export interface PaymentRequest {
  id: string;
  bookingRequestId: string;
  type: PaymentType;
  status: PaymentRequestStatus;
  currency: string;
  amountCents: number;
  platformFeeCents: number;
  clientChargeCents: number;
  artistNetCents: number;
  feePayer: "artist" | "client" | "split";
  clientEmail: string;
  description: string;
  payUrl: string;
  expiresAt: string;
  paidAt?: string;
  createdAt: string;
  jobTotalCents: number;
  depositAppliedCents: number;
}

export interface CreatePaymentRequestPayload {
  type: PaymentType;
  amountCents?: number;
}

export interface RequestPaymentForm {
  type: PaymentType;
  amount: string;
}

export interface PublicPaymentRequest {
  status: PaymentRequestStatus;
  type: PaymentType;
  currency: string;
  clientChargeCents: number;
  artistName: string;
  clientEmail: string;
  clientName: string;
  description: string;
  expired: boolean;
  hasAccount: boolean;
}

export interface CheckoutResponse {
  url: string;
}

export interface CreateClientAccountPayload {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  marketingOptIn: boolean;
}
