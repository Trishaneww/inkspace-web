// Types
import type {
  PaymentType,
  PaymentRequestStatus,
  RecencyFilter,
  RequestType,
} from "./bookings";

export interface TransactionTotals {
  collectedCents: number;
  feeCents: number;
  netCents: number;
  count: number;
}

export interface RecentPayment {
  id: string;
  reference: string;
  type: PaymentType;
  status: PaymentRequestStatus;
  currency: string;
  amountCents: number;
  platformFeeCents: number;
  clientChargeCents: number;
  clientName: string;
  clientEmail: string;
  requestType: RequestType;
  placement: string;
  paidAt: string;
}

export interface Transactions {
  issuerName: string;
  currency: string;
  allTime: TransactionTotals;
  thisMonth: TransactionTotals;
  recentPayments: RecentPayment[];
}

export type TransactionTab = "income" | "payouts";

export type PaymentTypeFilter = "all" | PaymentType;

export interface PaymentFilters {
  search: string;
  type: PaymentTypeFilter;
  recency: RecencyFilter;
}

/* ── Payouts (Stripe → bank transfers) ─────────────────────────────────── */
export type PayoutStatus =
  | "paid"
  | "in_transit"
  | "pending"
  | "failed"
  | "canceled";

export interface Payout {
  id: string;
  reference: string;
  currency: string;
  amountCents: number;
  status: PayoutStatus;
  bankLast4: string;
  initiatedAt: string;
  arrivalAt: string;
}
