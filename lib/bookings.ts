// Libs
import { INQUIRY_ACTIONS } from "@/constants/bookings";
import type {
  BookingFilters,
  InquiryAction,
  RecencyFilter,
  Inquiry,
} from "@/types/bookings";

const RECENCY_WINDOW_DAYS: Record<Exclude<RecencyFilter, "all">, number> = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
};

export function filterInquiries(
  inquiries: Inquiry[],
  filters: BookingFilters,
): Inquiry[] {
  const query = filters.search.trim().toLowerCase();
  const matched = inquiries.filter((inquiry) => {
    if (filters.status !== "all" && inquiry.status !== filters.status) {
      return false;
    }
    if (filters.recency !== "all") {
      const submitted = new Date(inquiry.createdAt).getTime();
      const windowMs = RECENCY_WINDOW_DAYS[filters.recency] * 86_400_000;
      if (Number.isNaN(submitted) || Date.now() - submitted > windowMs) {
        return false;
      }
    }
    if (
      query &&
      !inquiry.clientName.toLowerCase().includes(query) &&
      !inquiry.clientEmail.toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });

  return matched.sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return filters.sort === "oldest" ? aTime - bTime : bTime - aTime;
  });
}

export function hasActiveBookingFilters(filters: BookingFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.recency !== "all" ||
    filters.sort !== "newest"
  );
}

export function getInquiryActions(inquiry: Inquiry): InquiryAction[] {
  return INQUIRY_ACTIONS.filter((action) => action.isAvailable(inquiry));
}

export function formatRelativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1mo ago" : `${months}mo ago`;
}

export function requestMeta(inquiry: Inquiry): string {
  const parts: string[] = [];
  if (inquiry.placement) parts.push(inquiry.placement);
  if (inquiry.approxSizeInches) parts.push(`${inquiry.approxSizeInches}"`);
  return parts.join(" · ") || "—";
}