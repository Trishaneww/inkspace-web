// Libs
import {
  TierFormRow,
  type Flash,
  type FlashPricingTier,
  type FlashSizeCode,
  type FlashStatus,
} from "@/types/flash";
import { FLASH_SIZE_OPTIONS } from "@/constants/flashes";
import { formatCurrency } from "@/lib/formatters";

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
