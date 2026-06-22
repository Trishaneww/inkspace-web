"use client";

// HTML Components
import { FiltersRow } from "@/components/dashboard/artist/FiltersRow";

// Libs
import { RECENCY_FILTER_OPTIONS } from "@/constants/bookings";
import { PAYMENT_TYPE_FILTER_OPTIONS } from "@/constants/transactions";
import { hasActivePaymentFilters } from "@/lib/transactions/filterPayments";

// Types
import type { RecencyFilter } from "@/types/bookings";
import type { PaymentFilters, PaymentTypeFilter } from "@/types/transactions";
import type { FilterSelectConfig } from "@/types/filters";

interface IncomeFiltersProps {
  filters: PaymentFilters;
  onFilterChange: (patch: Partial<PaymentFilters>) => void;
  onReset: () => void;
}

export const IncomeFilters = ({
  filters,
  onFilterChange,
  onReset,
}: IncomeFiltersProps) => {
  const selects: FilterSelectConfig[] = [
    {
      placeholder: "Type",
      value: filters.type,
      options: PAYMENT_TYPE_FILTER_OPTIONS,
      onChange: (value) => onFilterChange({ type: value as PaymentTypeFilter }),
    },
    {
      placeholder: "Recency",
      value: filters.recency,
      options: RECENCY_FILTER_OPTIONS,
      onChange: (value) => onFilterChange({ recency: value as RecencyFilter }),
    },
  ];

  return (
    <FiltersRow
      searchValue={filters.search}
      searchPlaceholder="Search by client name or email"
      onSearchChange={(search) => onFilterChange({ search })}
      selects={selects}
      isFiltered={hasActivePaymentFilters(filters)}
      onReset={onReset}
      actions={[]}
    />
  );
};
