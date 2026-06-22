// Types
import type { RecencyFilter } from "@/types/bookings";
import type { PaymentFilters, RecentPayment } from "@/types/transactions";

const RECENCY_WINDOW_DAYS: Record<Exclude<RecencyFilter, "all">, number> = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
};

export function filterPayments(
  payments: RecentPayment[],
  filters: PaymentFilters,
): RecentPayment[] {
  const query = filters.search.trim().toLowerCase();

  return payments.filter((payment) => {
    if (filters.type !== "all" && payment.type !== filters.type) {
      return false;
    }
    if (filters.recency !== "all") {
      const paid = new Date(payment.paidAt).getTime();
      const windowMs = RECENCY_WINDOW_DAYS[filters.recency] * 86_400_000;
      if (Number.isNaN(paid) || Date.now() - paid > windowMs) {
        return false;
      }
    }
    if (
      query &&
      !payment.clientName.toLowerCase().includes(query) &&
      !payment.clientEmail.toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });
}

export function hasActivePaymentFilters(filters: PaymentFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.type !== "all" ||
    filters.recency !== "all"
  );
}
