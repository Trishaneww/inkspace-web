// Libs
import {
  type FilterOption,
  type FlashSizeOption,
  type FlashStatusFilter,
  type PriceSort,
  type RepeatableFilter,
} from "@/types/flash";

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
  { minutes: 30, label: "30 min" },
  { minutes: 45, label: "45 min" },
  { minutes: 60, label: "1 H" },
  { minutes: 90, label: "1.5 H" },
  { minutes: 120, label: "2 H" },
  { minutes: 150, label: "2.5 H" },
  { minutes: 180, label: "3 H" },
  { minutes: 210, label: "3.5 H" },
  { minutes: 240, label: "4 H" },
  { minutes: 300, label: "5 H" },
  { minutes: 360, label: "6 H" },
  { minutes: 420, label: "7 H" },
  { minutes: 480, label: "8 H" },
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
