"use client";

// Next.js
import { useState } from "react";

// CSS
import styles from "@/styles/dashboard/artist/Transactions.module.css";

// HTML Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

// Components
import { StatusBadge } from "@/components/dashboard/artist/bookings/StatusBadge";

// Libs
import { PAYOUT_STATUS_META } from "@/constants/transactions";
import { formatDate, formatPrice } from "@/lib/formatters";

// Types
import type { Payout } from "@/types/transactions";

interface PayoutsTableProps {
  payouts: Payout[];
  isLoading?: boolean;
}

const DEFAULT_PAGE_SIZE = 10;

export const PayoutsTable = ({ payouts, isLoading }: PayoutsTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  if (isLoading) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.emptyState}>
          <span className={styles.emptyText}>Loading payouts…</span>
        </div>
      </div>
    );
  }

  if (payouts.length === 0) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.emptyState}>
          <span className={styles.emptyTitle}>No payouts yet</span>
          <span className={styles.emptyText}>
            Transfers from Stripe to your bank account will show up here.
          </span>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(payouts.length / pageSize);
  const currentPage = Math.min(page, totalPages);
  const rows = payouts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <>
      <div className={styles.tableCard}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payout</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Initiated</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((payout) => {
              const status = PAYOUT_STATUS_META[payout.status];
              return (
                <TableRow key={payout.id}>
                  <TableCell className={styles.reference}>
                    {payout.reference}
                  </TableCell>
                  <TableCell>
                    <StatusBadge label={status.label} variant={status.variant} />
                  </TableCell>
                  <TableCell className={styles.type}>
                    {payout.bankLast4 ? `•••• ${payout.bankLast4}` : "Bank account"}
                  </TableCell>
                  <TableCell className={styles.paidOn}>
                    {formatDate(payout.initiatedAt)}
                  </TableCell>
                  <TableCell className={styles.paidOn}>
                    {formatDate(payout.arrivalAt)}
                  </TableCell>
                  <TableCell className={styles.net}>
                    {formatPrice(payout.amountCents, payout.currency)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        className={styles.pagination}
        page={currentPage}
        pageSize={pageSize}
        totalItems={payouts.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </>
  );
};
