"use client";

// Next.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// CSS
import styles from "@/styles/dashboard/artist/Transactions.module.css";

// Components
import { TransactionsStats } from "@/components/dashboard/artist/transactions/TransactionsStats";
import { TransactionTabs } from "@/components/dashboard/artist/transactions/TransactionTabs";
import { IncomeFilters } from "@/components/dashboard/artist/transactions/IncomeFilters";
import { IncomeTable } from "@/components/dashboard/artist/transactions/IncomeTable";
import { PayoutsTable } from "@/components/dashboard/artist/transactions/PayoutsTable";

// Libs
import { transactionsApi } from "@/lib/api/transactions";
import { useAuth } from "@/lib/auth";
import { openInvoicePdf } from "@/lib/invoice/openInvoicePdf";
import { filterPayments } from "@/lib/transactions/filterPayments";
import { EMPTY_PAYMENT_FILTERS } from "@/constants/transactions";

// Types
import type {
  PaymentFilters,
  Payout,
  RecentPayment,
  TransactionTab,
  Transactions,
} from "@/types/transactions";

export default function ArtistTransactionsPage() {
  const { token } = useAuth();

  const [transactions, setTransactions] = useState<Transactions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TransactionTab>("income");
  const [filters, setFilters] = useState<PaymentFilters>(EMPTY_PAYMENT_FILTERS);

  const [payouts, setPayouts] = useState<Payout[] | null>(null);
  const [payoutsError, setPayoutsError] = useState<string | null>(null);

  const lastFetchKey = useRef<string | null>(null);
  const payoutsRequested = useRef(false);

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      setTransactions(await transactionsApi.get(token));
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load transactions",
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (lastFetchKey.current === token) return;
    lastFetchKey.current = token;
    queueMicrotask(fetchTransactions);
  }, [fetchTransactions, token]);

  const fetchPayouts = useCallback(async () => {
    if (!token) return;
    setPayoutsError(null);
    try {
      setPayouts(await transactionsApi.getPayouts(token));
    } catch (err) {
      payoutsRequested.current = false;
      setPayoutsError(
        err instanceof Error ? err.message : "Failed to load payouts",
      );
    }
  }, [token]);

  useEffect(() => {
    if (activeTab !== "payouts" || payoutsRequested.current) return;
    payoutsRequested.current = true;
    queueMicrotask(fetchPayouts);
  }, [activeTab, fetchPayouts]);

  const visiblePayments = useMemo(
    () =>
      transactions ? filterPayments(transactions.recentPayments, filters) : [],
    [transactions, filters],
  );

  const updateFilters = (patch: Partial<PaymentFilters>) =>
    setFilters((current) => ({ ...current, ...patch }));

  const downloadInvoice = (payment: RecentPayment) =>
    openInvoicePdf(transactions?.issuerName ?? "", payment);

  return (
    <div className={styles.transactionsPage}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Transactions</h1>
        <span className={styles.headerSubtitle}>
          Money collected from clients and paid out to your bank
        </span>
      </div>

      {loadError && <div className={styles.errorBanner}>{loadError}</div>}

      {!isLoading && transactions && (
        <>
          <TransactionsStats transactions={transactions} />
          <TransactionTabs value={activeTab} onChange={setActiveTab} />

          {activeTab === "income" ? (
            <>
              <IncomeFilters
                filters={filters}
                onFilterChange={updateFilters}
                onReset={() => setFilters(EMPTY_PAYMENT_FILTERS)}
              />
              <IncomeTable
                payments={visiblePayments}
                onDownloadInvoice={downloadInvoice}
              />
            </>
          ) : payoutsError ? (
            <div className={styles.errorBanner}>{payoutsError}</div>
          ) : (
            <PayoutsTable payouts={payouts ?? []} isLoading={payouts === null} />
          )}
        </>
      )}
    </div>
  );
}
