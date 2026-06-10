// Libs
import {
  type FlashSizeOption,
  type FlashStatusFilter,
  type PriceSort,
  type RepeatableFilter,
} from "@/types/flash";
import type { FilterOption } from "@/types/filters";

export const DEFAULT_CURRENCY = "CAD";
export const ARTIST_DASHBOARD_ROOT = "/dashboard/artist";

export const FLASH_SIZE_OPTIONS: FlashSizeOption[] = [
  { code: "x_small", label: "X-Small", description: "Less than 1 inch" },
  { code: "small", label: "Small", description: "1-2 inches" },
  { code: "medium", label: "Medium", description: "3-4 inches" },
  { code: "large", label: "Large", description: "5-6 inches" },
  { code: "x_large", label: "X-Large", description: "7+ inches" },
];

export const DURATION_OPTIONS = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1h" },
  { value: 90, label: "1.5h" },
  { value: 120, label: "2h" },
  { value: 150, label: "2.5h" },
  { value: 180, label: "3h" },
  { value: 210, label: "3.5h" },
  { value: 240, label: "4h" },
  { value: 300, label: "5h" },
  { value: 360, label: "6h" },
  { value: 420, label: "7h" },
  { value: 480, label: "8h" },
];

export const STATUS_FILTER_OPTIONS: FilterOption<FlashStatusFilter>[] = [
  { value: "all", label: "All statuses" },
  { value: "available", label: "Available" },
  { value: "claimed", label: "Claimed" },
  { value: "archived", label: "Archived" },
];

export const REPEATABLE_FILTER_OPTIONS: FilterOption<RepeatableFilter>[] = [
  { value: "all", label: "Any type" },
  { value: "repeatable", label: "Repeatable" },
  { value: "non_repeatable", label: "Non-repeatable" },
];

export const PRICE_SORT_OPTIONS: FilterOption<PriceSort>[] = [
  { value: "none", label: "Sort by price" },
  { value: "high_to_low", label: "Price: high to low" },
  { value: "low_to_high", label: "Price: low to high" },
];
