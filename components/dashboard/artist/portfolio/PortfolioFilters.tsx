"use client";

// HTML Components
import { PlusIcon } from "lucide-react";
import { FiltersRow } from "@/components/dashboard/artist/FiltersRow";

// Libs
import type { FilterSelectConfig } from "@/types/filters";
import {
  hasActivePortfolioFilters,
  type PortfolioFilters as Filters,
} from "@/lib/portfolio";
import {
  COLOR_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
  STYLE_FILTER_OPTIONS,
} from "@/constants/portfolio";

interface PortfolioFiltersProps {
  filters: Filters;
  onFilterChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
  onAddItem: () => void;
}

export const PortfolioFilters = ({
  filters,
  onFilterChange,
  onReset,
  onAddItem,
}: PortfolioFiltersProps) => {
  const selects: FilterSelectConfig[] = [
    {
      placeholder: "Status",
      value: filters.status,
      options: STATUS_FILTER_OPTIONS,
      onChange: (value) =>
        onFilterChange({ status: value as Filters["status"] }),
    },
    {
      placeholder: "Style",
      value: filters.style,
      options: STYLE_FILTER_OPTIONS,
      onChange: (value) => onFilterChange({ style: value }),
    },
    {
      placeholder: "Color",
      value: filters.color,
      options: COLOR_FILTER_OPTIONS,
      onChange: (value) => onFilterChange({ color: value as Filters["color"] }),
    },
  ];

  return (
    <FiltersRow
      searchValue={filters.search}
      searchPlaceholder="Search by title"
      onSearchChange={(search) => onFilterChange({ search })}
      selects={selects}
      isFiltered={hasActivePortfolioFilters(filters)}
      onReset={onReset}
      actions={[{ label: "Add piece", onClick: onAddItem, icon: PlusIcon }]}
    />
  );
};
