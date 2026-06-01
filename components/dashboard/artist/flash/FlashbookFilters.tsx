"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Flashbook.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { PlusIcon, Search } from "lucide-react";

// Libs
import type {
  FilterOption,
  FlashStatusFilter,
  PriceSort,
  RepeatableFilter,
} from "@/types/flash";
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
  const isFiltered = hasActiveFlashFilters(filters);

  return (
    <div className={styles.filters}>
      <div className={styles.searchField}>
        <Search size={16} className={styles.searchIcon} />
        <Input
          type="search"
          placeholder="Search by flash name"
          value={filters.search}
          onChange={(event) => onFilterChange({ search: event.target.value })}
          className={styles.searchInput}
        />
      </div>

      <FilterSelect
        placeholder="Status"
        value={filters.status}
        options={STATUS_FILTER_OPTIONS}
        onChange={(status: FlashStatusFilter) => onFilterChange({ status })}
      />

      <FilterSelect
        placeholder="Type"
        value={filters.repeatable}
        options={REPEATABLE_FILTER_OPTIONS}
        onChange={(repeatable: RepeatableFilter) =>
          onFilterChange({ repeatable })
        }
      />

      <FilterSelect
        placeholder="Price"
        value={filters.priceSort}
        options={PRICE_SORT_OPTIONS}
        onChange={(priceSort: PriceSort) => onFilterChange({ priceSort })}
      />

      <Button
        type="button"
        variant="ghost"
        className={styles.resetBtn}
        onClick={onReset}
        disabled={!isFiltered}
      >
        Reset filters
      </Button>

      <Button type="button" className={styles.addFlashBtn} onClick={onAddFlash}>
        <PlusIcon className={styles.btnIcon} />
        Add flash
      </Button>
    </div>
  );
};

interface FilterSelectProps<TValue extends string> {
  placeholder: string;
  value: TValue;
  options: FilterOption<TValue>[];
  onChange: (value: TValue) => void;
}

const FilterSelect = <TValue extends string>({
  placeholder,
  value,
  options,
  onChange,
}: FilterSelectProps<TValue>) => {
  const isDefault = value === options[0].value;
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <Select value={value} onValueChange={(next) => next && onChange(next)}>
      <SelectTrigger className={styles.filterSelect}>
        <span className={clsx(isDefault && styles.selectPlaceholder)}>
          {isDefault ? placeholder : selectedLabel}
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
