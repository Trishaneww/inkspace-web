// Libs
import {
  TierFormRow,
  type Flash,
  type FlashPricingTier,
  type FlashSizeCode,
  type FlashStatus,
  type FlashStatusFilter,
  type PriceSort,
  type RepeatableFilter,
} from "@/types/flash";
import { FLASH_SIZE_OPTIONS } from "@/constants/flashes";
import { formatCurrency, formatPriceCents } from "@/lib/formatters";

export interface FlashStats {
  available: number;
  claimed: number;
  archived: number;
  totalViews: number;
}

export interface FlashFilters {
  search: string;
  status: FlashStatusFilter;
  repeatable: RepeatableFilter;
  priceSort: PriceSort;
}

export const EMPTY_FLASH_FILTERS: FlashFilters = {
  search: "",
  status: "all",
  repeatable: "all",
  priceSort: "none",
};

export function getFlashStats(flashes: Flash[]): FlashStats {
  return flashes.reduce<FlashStats>(
    (stats, flash) => {
      if (flash.status === "available") stats.available += 1;
      if (flash.status === "claimed") stats.claimed += 1;
      if (flash.status === "archived") stats.archived += 1;
      stats.totalViews += flash.view_count;
      return stats;
    },
    { available: 0, claimed: 0, archived: 0, totalViews: 0 },
  );
}

function sortByPrice(flashes: Flash[], priceSort: PriceSort): Flash[] {
  if (priceSort === "none") return flashes;

  return [...flashes].sort((a, b) => {
    const priceA = getStartingPrice(a);
    const priceB = getStartingPrice(b);
    if (priceA === null) return priceB === null ? 0 : 1;
    if (priceB === null) return -1;
    return priceSort === "high_to_low" ? priceB - priceA : priceA - priceB;
  });
}

export function filterFlashes(
  flashes: Flash[],
  filters: FlashFilters,
): Flash[] {
  const search = filters.search.trim().toLowerCase();

  const matched = flashes.filter((flash) => {
    if (search && !flash.title.toLowerCase().includes(search)) return false;
    if (filters.status !== "all" && flash.status !== filters.status) {
      return false;
    }
    if (filters.repeatable === "repeatable" && !flash.repeatable) return false;
    if (filters.repeatable === "non_repeatable" && flash.repeatable) {
      return false;
    }
    return true;
  });

  return sortByPrice(matched, filters.priceSort);
}

export function hasActiveFlashFilters(filters: FlashFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.repeatable !== "all" ||
    filters.priceSort !== "none"
  );
}

export function getStartingPrice(flash: Flash): number | null {
  if (flash.pricing_mode === "flat") {
    return flash.flat_price_cents ?? null;
  }
  if (flash.pricing_tiers.length === 0) return null;
  return Math.min(...flash.pricing_tiers.map((tier) => tier.price_cents));
}

export function formatSizeCodesList(tiers: FlashPricingTier[]): string {
  const shortLabels: Record<FlashSizeCode, string> = {
    x_small: "XS",
    small: "S",
    medium: "M",
    large: "L",
    x_large: "XL",
  };

  const orderedCodes = FLASH_SIZE_OPTIONS.map((option) => option.code);
  return orderedCodes
    .filter((code) => tiers.some((tier) => tier.size_code === code))
    .map((code) => shortLabels[code])
    .join(", ");
}

export function getFlashStatusLabel(status: FlashStatus): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "available":
      return "Available";
    case "claimed":
      return "Claimed";
    case "archived":
      return "Archived";
  }
}

export function buildTierRowsFromFlash(
  tiers: FlashPricingTier[],
): Record<FlashSizeCode, TierFormRow> {
  const rows = buildBlankTierRows();
  for (const tier of tiers) {
    rows[tier.size_code] = {
      enabled: true,
      durationMinutes: tier.duration_minutes.toString(),
      priceDollars: formatCurrency((tier.price_cents / 100).toString()),
    };
  }
  return rows;
}

export function buildBlankTierRows(): Record<FlashSizeCode, TierFormRow> {
  return {
    x_small: { enabled: false, durationMinutes: "", priceDollars: "" },
    small: { enabled: false, durationMinutes: "", priceDollars: "" },
    medium: { enabled: false, durationMinutes: "", priceDollars: "" },
    large: { enabled: false, durationMinutes: "", priceDollars: "" },
    x_large: { enabled: false, durationMinutes: "", priceDollars: "" },
  };
}

export function buildPricingTiersFromRows(
  rows: Record<FlashSizeCode, TierFormRow>,
): FlashPricingTier[] {
  const out: FlashPricingTier[] = [];
  for (const code of Object.keys(rows) as FlashSizeCode[]) {
    const row = rows[code];
    if (!row.enabled) continue;
    const priceCents = convertDollarsToCents(row.priceDollars);
    const minutes = parseInt(row.durationMinutes, 10);
    if (!priceCents || priceCents <= 0) continue;
    if (!minutes || minutes <= 0) continue;
    out.push({
      size_code: code,
      duration_minutes: minutes,
      price_cents: priceCents,
    });
  }
  return out;
}

export function convertDollarsToCents(input: string): number | null {
  const trimmed = input.replace(/[$,\s]/g, "");
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

export function formatFlashPriceRange(flash: Flash): string {
  if (flash.pricing_mode === "flat") {
    return flash.flat_price_cents != null
      ? formatPriceCents(flash.flat_price_cents, flash.currency)
      : "";
  }
  const prices = flash.pricing_tiers.map((tier) => tier.price_cents);
  if (prices.length === 0) return "";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max
    ? formatPriceCents(min, flash.currency)
    : `${formatPriceCents(min, flash.currency)} – ${formatPriceCents(max, flash.currency)}`;
}
