// Libs
import { format, isValid, parseISO } from "date-fns";

export function formatPriceCents(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

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

export function formatDate(iso: string): string {
  const parsed = parseISO(iso);
  const date = isValid(parsed) ? parsed : new Date(iso);
  return isValid(date) ? format(date, "MMM d, yyyy") : iso;
}

export function parseCsv(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
