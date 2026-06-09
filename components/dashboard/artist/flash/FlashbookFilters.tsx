"use client";

// HTML Components
import { PlusIcon } from "lucide-react";
import { FiltersRow } from "@/components/dashboard/artist/FiltersRow";

// Libs
import type { FilterSelectConfig } from "@/types/filters";
import type { FlashFilters } from "@/lib/flashes";
import { hasActiveFlashFilters } from "@/lib/flashes";
import {
  PRICE_SORT_OPTIONS,
  REPEATABLE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from "@/constants/flashes";

interface FlashbookFiltersProps {
  filters: FlashFilters;
  onFilterChange: (patch: Partial<FlashFilters>) => void;
  onReset: () => void;
  onAddFlash: () => void;
}

export const FlashbookFilters = ({
  filters,
  onFilterChange,
  onReset,
  onAddFlash,
}: FlashbookFiltersProps) => {
  const selects: FilterSelectConfig[] = [
    {
      placeholder: "Status",
      value: filters.status,
      options: STATUS_FILTER_OPTIONS,
      onChange: (value) =>
        onFilterChange({ status: value as FlashFilters["status"] }),
    },
    {
      placeholder: "Type",
      value: filters.repeatable,
      options: REPEATABLE_FILTER_OPTIONS,
      onChange: (value) =>
        onFilterChange({ repeatable: value as FlashFilters["repeatable"] }),
    },
    {
      placeholder: "Price",
      value: filters.priceSort,
      options: PRICE_SORT_OPTIONS,
      onChange: (value) =>
        onFilterChange({ priceSort: value as FlashFilters["priceSort"] }),
    },
  ];

  return (
    <FiltersRow
      searchValue={filters.search}
      searchPlaceholder="Search by flash name"
      onSearchChange={(search) => onFilterChange({ search })}
      selects={selects}
      isFiltered={hasActiveFlashFilters(filters)}
      onReset={onReset}
      actions={[
        { label: "Add flash", onClick: onAddFlash, icon: PlusIcon },
      ]}
    />
  );
};
