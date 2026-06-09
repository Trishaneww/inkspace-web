"use client";

// HTML Components
import { Loader2, PlusIcon } from "lucide-react";
import { FiltersRow } from "@/components/dashboard/artist/FiltersRow";

// Libs
import type { FilterAction, FilterSelectConfig } from "@/types/filters";
import {
  hasActiveBookingFilters,
  RECENCY_FILTER_OPTIONS,
  SORT_OPTIONS,
  STATUS_FILTER_OPTIONS,
  type BookingFilters,
  type RecencyFilter,
  type SortOrder,
  type StatusFilter,
} from "@/lib/bookings";

interface BookingsFiltersProps {
  filters: BookingFilters;
  onFilterChange: (patch: Partial<BookingFilters>) => void;
  onReset: () => void;
  onCreateBooking: () => void;
  onSeed?: () => void;
  isSeeding?: boolean;
}

export const BookingsFilters = ({
  filters,
  onFilterChange,
  onReset,
  onCreateBooking,
  onSeed,
  isSeeding,
}: BookingsFiltersProps) => {
  const selects: FilterSelectConfig[] = [
    {
      placeholder: "Status",
      value: filters.status,
      options: STATUS_FILTER_OPTIONS,
      onChange: (value) => onFilterChange({ status: value as StatusFilter }),
    },
    {
      placeholder: "Recency",
      value: filters.recency,
      options: RECENCY_FILTER_OPTIONS,
      onChange: (value) => onFilterChange({ recency: value as RecencyFilter }),
    },
    {
      placeholder: "Sort",
      value: filters.sort,
      options: SORT_OPTIONS,
      onChange: (value) => onFilterChange({ sort: value as SortOrder }),
    },
  ];

  const actions: FilterAction[] = [];
  if (onSeed) {
    actions.push({
      label: isSeeding ? "Seeding" : "Seed test inquiries",
      onClick: onSeed,
      tone: "secondary",
      disabled: isSeeding,
      trailing: isSeeding ? (
        <Loader2 size={14} className="animate-spin" />
      ) : undefined,
    });
  }
  actions.push({
    label: "Create booking",
    onClick: onCreateBooking,
    icon: PlusIcon,
  });

  return (
    <FiltersRow
      searchValue={filters.search}
      searchPlaceholder="Search by client name or email"
      onSearchChange={(search) => onFilterChange({ search })}
      selects={selects}
      isFiltered={hasActiveBookingFilters(filters)}
      onReset={onReset}
      actions={actions}
    />
  );
};
