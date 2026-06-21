// Types
import type {
  PaymentFilters,
  PaymentTypeFilter,
  PayoutStatus,
} from "@/types/transactions";
import type { BadgeMeta } from "@/types/bookings";
import type { FilterOption } from "@/types/filters";

export const EMPTY_PAYMENT_FILTERS: PaymentFilters = {
  search: "",
  type: "all",
  recency: "all",
};

export const PAYMENT_TYPE_FILTER_OPTIONS: FilterOption<PaymentTypeFilter>[] = [
  { value: "all", label: "All types" },
  { value: "deposit", label: "Deposit" },
  { value: "final", label: "Session payment" },
];

export const PAYOUT_STATUS_META: Record<PayoutStatus, BadgeMeta> = {
  paid: { label: "Paid", variant: "success" },
  in_transit: { label: "In transit", variant: "indigo" },
  pending: { label: "Pending", variant: "pending" },
  failed: { label: "Failed", variant: "failure" },
  canceled: { label: "Canceled", variant: "inactive" },
};
