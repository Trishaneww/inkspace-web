"use client";

// Next.js
import { useState } from "react";

// CSS
import styles from "@/styles/dashboard/artist/Earnings.module.css";

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
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

// Components
import { InitialsAvatar } from "@/components/common/InitialsAvatar";

// Libs
import { PAYMENT_TYPE_LABELS } from "@/constants/bookings";
import { formatDate, formatPrice } from "@/lib/formatters";

// Types
import type { RecentPayment } from "@/types/earnings";

interface EarningsTableProps {
  payments: RecentPayment[];
  onDownloadInvoice: (payment: RecentPayment) => Promise<void>;
}

const DEFAULT_PAGE_SIZE = 10;

export const EarningsTable = ({
  payments,
  onDownloadInvoice,
}: EarningsTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [prevList, setPrevList] = useState(payments);
  if (payments !== prevList) {
    setPrevList(payments);
    setPage(1);
  }

  if (payments.length === 0) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.emptyState}>
          <span className={styles.emptyTitle}>No payments found</span>
          <span className={styles.emptyText}>
            Paid deposits and session payments will show up here.
          </span>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(payments.length / pageSize);
  const currentPage = Math.min(page, totalPages);
  const rows = payments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDownload = async (payment: RecentPayment) => {
    setBusyId(payment.id);
    try {
      await onDownloadInvoice(payment);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <div className={styles.tableCard}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Net</TableHead>
              <TableHead aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((payment) => {
              const netCents =
                payment.clientChargeCents - payment.platformFeeCents;
              return (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className={styles.clientCell}>
                      <InitialsAvatar
                        name={payment.clientName}
                        seed={payment.clientEmail}
                      />
                      <div className={styles.clientText}>
                        <div className={styles.clientName}>
                          {payment.clientName}
                        </div>
                        <span className={styles.clientEmail}>
                          {payment.clientEmail}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={styles.reference}>
                    {payment.reference}
                  </TableCell>
                  <TableCell className={styles.type}>
                    {PAYMENT_TYPE_LABELS[payment.type]}
                  </TableCell>
                  <TableCell className={styles.paidOn}>
                    {payment.paidAt ? formatDate(payment.paidAt) : "—"}
                  </TableCell>
                  <TableCell className={styles.amount}>
                    {formatPrice(payment.clientChargeCents, payment.currency)}
                  </TableCell>
                  <TableCell className={styles.net}>
                    {formatPrice(netCents, payment.currency)}
                  </TableCell>
                  <TableCell className={styles.actionsCell}>
                    <div className={styles.rowActions}>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={busyId === payment.id}
                        onClick={() => handleDownload(payment)}
                      >
                        {busyId === payment.id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Download size={15} />
                        )}
                        Invoice
                      </Button>
                    </div>
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
        totalItems={payments.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </>
  );
};
