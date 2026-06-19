// Types
import type { PaymentFilters, PaymentTypeFilter } from "@/types/earnings";
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
