"use client";

// Next.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// CSS
import styles from "@/styles/dashboard/artist/Earnings.module.css";

// Components
import { EarningsStats } from "@/components/dashboard/artist/earnings/EarningsStats";
import { EarningsFilters } from "@/components/dashboard/artist/earnings/EarningsFilters";
import { EarningsTable } from "@/components/dashboard/artist/earnings/EarningsTable";

// Libs
import { earningsApi } from "@/lib/api/earnings";
import { useAuth } from "@/lib/auth";
import { openInvoicePdf } from "@/lib/invoice/openInvoicePdf";
import { filterPayments } from "@/lib/earnings/filterPayments";
import { EMPTY_PAYMENT_FILTERS } from "@/constants/earnings";

// Types
import type { Earnings, PaymentFilters, RecentPayment } from "@/types/earnings";

export default function ArtistEarningsPage() {
  const { token } = useAuth();

  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentFilters>(EMPTY_PAYMENT_FILTERS);

  const lastFetchKey = useRef<string | null>(null);

  const fetchEarnings = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      setEarnings(await earningsApi.get(token));
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load earnings",
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (lastFetchKey.current === token) return;
    lastFetchKey.current = token;
    queueMicrotask(fetchEarnings);
  }, [fetchEarnings, token]);

  const visiblePayments = useMemo(
    () => (earnings ? filterPayments(earnings.recentPayments, filters) : []),
    [earnings, filters],
  );

  const updateFilters = (patch: Partial<PaymentFilters>) =>
    setFilters((current) => ({ ...current, ...patch }));

  const downloadInvoice = (payment: RecentPayment) =>
    openInvoicePdf(earnings?.issuerName ?? "", payment);

  return (
    <div className={styles.earningsPage}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Earnings</h1>
        <span className={styles.headerSubtitle}>
          What you have collected and your invoices
        </span>
      </div>

      {loadError && <div className={styles.errorBanner}>{loadError}</div>}

      {!isLoading && earnings && (
        <>
          <EarningsStats earnings={earnings} />
          <EarningsFilters
            filters={filters}
            onFilterChange={updateFilters}
            onReset={() => setFilters(EMPTY_PAYMENT_FILTERS)}
          />
          <EarningsTable
            payments={visiblePayments}
            onDownloadInvoice={downloadInvoice}
          />
        </>
      )}
    </div>
  );
}
