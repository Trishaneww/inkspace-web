// Types
import type {
  PaymentType,
  PaymentRequestStatus,
  RecencyFilter,
  RequestType,
} from "./bookings";

export interface EarningsTotals {
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

export interface Earnings {
  issuerName: string;
  currency: string;
  allTime: EarningsTotals;
  thisMonth: EarningsTotals;
  recentPayments: RecentPayment[];
}

export type PaymentTypeFilter = "all" | PaymentType;

export interface PaymentFilters {
  search: string;
  type: PaymentTypeFilter;
  recency: RecencyFilter;
}
