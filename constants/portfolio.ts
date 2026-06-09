// Libs
import { FilterOption } from "@/types/filters";
import {
  PortfolioColorFilter,
  PortfolioColorType,
  PortfolioStatusFilter,
} from "@/types/portfolio";
import { TATTOO_STYLE_OPTIONS } from "./tattooStyles";
import { PortfolioFilters } from "@/lib/portfolio";

export const EMPTY_PORTFOLIO_FILTERS: PortfolioFilters = {
  search: "",
  status: "all",
  style: "all",
  color: "all",
};

export const STATUS_FILTER_OPTIONS: FilterOption<PortfolioStatusFilter>[] = [
  { value: "all", label: "All statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

export const COLOR_TYPE_LABELS: Record<PortfolioColorType, string> = {
  black_and_grey: "Black & grey",
  color: "Color",
};

export const COLOR_FILTER_OPTIONS: FilterOption<PortfolioColorFilter>[] = [
  { value: "all", label: "Any color" },
  { value: "black_and_grey", label: "Black & grey" },
  { value: "color", label: "Color" },
];

export const STYLE_FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "All styles" },
  ...TATTOO_STYLE_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  })),
];
