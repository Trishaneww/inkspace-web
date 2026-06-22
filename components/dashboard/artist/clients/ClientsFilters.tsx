"use client";

// HTML Components
import { FiltersRow } from "@/components/dashboard/artist/FiltersRow";

// Libs
import { CLIENT_SORT_OPTIONS } from "@/constants/clients";
import { hasActiveClientFilters } from "@/lib/clients/filterClients";

// Types
import type { ClientFilters, ClientSortOrder } from "@/types/clients";
import type { FilterSelectConfig } from "@/types/filters";

interface ClientsFiltersProps {
  filters: ClientFilters;
  onFilterChange: (patch: Partial<ClientFilters>) => void;
  onReset: () => void;
}

export const ClientsFilters = ({
  filters,
  onFilterChange,
  onReset,
}: ClientsFiltersProps) => {
  const selects: FilterSelectConfig[] = [
    {
      placeholder: "Sort",
      value: filters.sort,
      options: CLIENT_SORT_OPTIONS,
      onChange: (value) => onFilterChange({ sort: value as ClientSortOrder }),
    },
  ];

  return (
    <FiltersRow
      searchValue={filters.search}
      searchPlaceholder="Search by name, email, or phone"
      onSearchChange={(search) => onFilterChange({ search })}
      selects={selects}
      isFiltered={hasActiveClientFilters(filters)}
      onReset={onReset}
      actions={[]}
    />
  );
};
