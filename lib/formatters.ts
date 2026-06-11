// Libs
import { format, isValid, parseISO } from "date-fns";

/**
 * Formats a currency amount in cents as a string,
 * e.g. 123456 -> "$1,234.56".
 * @param cents - The currency amount in cents.
 * @param currency - The currency to format.
 * @returns The formatted currency amount.
 */
export function formatPriceCents(cents: number, currency = "CAD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/**
 * Formats a currency amount as a string,
 * e.g. "1234.56" -> "$1,234.56".
 * @param input - The currency amount to format.
 * @returns The formatted currency amount.
 */
export function formatCurrency(input: string): string {
  const cleaned = input.replace(/[^\d.]/g, "");
  if (cleaned === "") return "";

  const firstDot = cleaned.indexOf(".");
  const hasDecimal = firstDot !== -1;

  // Strip leading zeros from the whole-dollar part, but keep a single "0".
  const intDigits = (hasDecimal ? cleaned.slice(0, firstDot) : cleaned).replace(
    /^0+(?=\d)/,
    "",
  );
  const intPart = intDigits === "" ? "0" : intDigits;
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (!hasDecimal) return `$${withCommas}`;

  // Collapse any extra dots and cap the cents at two digits. An empty
  // fraction is preserved (".") so the user can keep typing.
  const fracDigits = cleaned
    .slice(firstDot + 1)
    .replace(/\./g, "")
    .slice(0, 2);
  return `$${withCommas}.${fracDigits}`;
}

/**
 * Formats a phone number as a North-American (Canadian) phone number,
 * e.g. "4161234567" -> "+1 (416) 123-4567".
 * @param input - The phone number to format.
 * @returns The formatted phone number.
 */
export function formatPhone(input: string): string {
  const digits = input.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
  if (digits === "") return "";

  const area = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const line = digits.slice(6, 10);

  if (digits.length <= 3) return `+1 (${area}`;
  if (digits.length <= 6) return `+1 (${area}) ${prefix}`;
  return `+1 (${area}) ${prefix}-${line}`;
}

/**
 * Formats a cents amount as an editable currency input string,
 * e.g. 1500 -> "$15.00", null -> "" (empty, so the field reads as unset).
 * @param cents - The amount in cents, or null when there is no value.
 * @returns The formatted currency string for an input field.
 */
export function formatCentsAsInput(cents: number | null): string {
  return cents != null ? formatCurrency((cents / 100).toString()) : "";
}

/**
 * Formats a date in ISO 8601 format as a human-readable date string,
 * e.g. "2026-06-03" -> "Jun 3, 2026".
 * @param iso - The ISO 8601 date string to format.
 * @returns The formatted date string.
 */
export function formatDate(iso: string): string {
  const parsed = parseISO(iso);
  const date = isValid(parsed) ? parsed : new Date(iso);
  return isValid(date) ? format(date, "MMM d, yyyy") : iso;
}

/**
 * Formats minutes-from-midnight (0..1440) as a 12-hour clock time,
 * e.g. 630 -> "10:30 AM", 1020 -> "5:00 PM", 1440 -> "12:00 AM".
 * @param minutes - The minutes from midnight to format.
 * @returns The formatted time in 12-hour format.
 */
export function formatTimeOfDay(minutes: number): string {
  if (minutes >= 1440) return "12:00 AM";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours < 12 ? "AM" : "PM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${mins.toString().padStart(2, "0")} ${period}`;
}

/**
 * Formats a duration in minutes as a compact human-readable string,
 * e.g. 45 -> "~45 min", 60 -> "~1 hour", 90 -> "~1.5 hours".
 * @param minutes - The duration in minutes to format.
 * @returns The formatted duration string.
 */
export function formatDurationMinutes(minutes: number): string {
  if (minutes < 60) return `~${minutes} min`;
  const hours = minutes / 60;
  const label = Number.isInteger(hours) ? `${hours}` : hours.toFixed(1);
  return `~${label} hour${hours === 1 ? "" : "s"}`;
}

/**
 * Parses an ISO 8601 date string (YYYY-MM-DD) into a local-timezone Date,
 * e.g. "2026-06-03" -> new Date(2026, 5, 3).
 * Using the Date constructor directly with a YYYY-MM-DD string parses as UTC
 * midnight, which can shift the calendar date in negative-offset timezones.
 * @param value - The ISO 8601 date string to parse.
 * @returns The parsed Date in local timezone.
 */
export function parseISODate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Looks up the label for a select value, e.g. "1" -> "Option 1". Works for any
 * value type (string, number, null) so it can label both raw <Select> values
 * and the typed option sets in our constants. Falls back to the stringified
 * value when no option matches.
 * @param value - The value to format.
 * @param options - The options to search.
 * @returns The matching option's label, or the stringified value.
 */
export function formatSelectValue<T>(
  value: T,
  options: { value: T; label: string }[],
): string {
  return options.find((o) => o.value === value)?.label ?? String(value);
}

/**
 * Formats a boolean value as a "On" or "Off" string,
 * e.g. true -> "On", false -> "Off".
 * @param bool - The boolean value to format.
 * @returns The formatted "On" or "Off" string.
 */
export function formatOnOffLabel(bool: boolean): string {
  return bool ? "On" : "Off";
}

/**
 * Formats a date range as a human-readable string,
 * e.g. "2026-06-03" -> "Jun 3, 2026 – Jun 5, 2026".
 * @param start - The start date in ISO 8601 format.
 * @param end - The end date in ISO 8601 format.
 * @returns The formatted date range string.
 */
export function formatDateRange(
  start: string | null,
  end: string | null,
): string {
  if (!start || !end) return "";
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export interface FormattableLocation {
  address?: string | null;
  city: string;
  country: string;
  label?: string;
}

/**
 * Formats a location as a plain place string — the street address first when
 * present, then the city and country, e.g.
 * { address: "123 Main St", city: "Chicago", country: "USA" } -> "123 Main St, Chicago, USA".
 * Falls back to the label when address, city, and country are all absent.
 * @param location - The location to format.
 * @returns The formatted location string.
 */
export function formatLocation(location: FormattableLocation): string {
  const parts = [location.address, location.city, location.country]
    .map((part) => part?.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : (location.label ?? "");
}

export interface DatedLocation {
  city: string;
  country: string;
  label: string;
  isPrimary: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

/**
 * Formats a location with the dates it's active, for places where the time
 * range matters (e.g. the studio travel & guest spots picker). The home studio
 * is tagged "(home)"; guest spots carry their date range, e.g.
 * { city: "Bali", country: "Indonesia", startDate: "2026-06-18", endDate: "2026-06-20" }
 *   -> "Bali, Indonesia · Jun 18, 2026 – Jun 20, 2026".
 * Falls back to label when city and country are both absent.
 * @param location - The location to format.
 * @returns The formatted location string.
 */
export function formatLocationWithTimeRange(location: DatedLocation): string {
  const place =
    [location.city, location.country].filter(Boolean).join(", ") ||
    location.label;

  if (location.isPrimary) {
    return place ? `${place} (home)` : "Home studio";
  }

  return location.startDate
    ? `${place} · ${formatDateRange(location.startDate, location.endDate ?? null)}`
    : place;
}