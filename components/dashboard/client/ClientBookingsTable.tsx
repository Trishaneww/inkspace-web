"use client";

// Next.js
import Link from "next/link";
import { useState } from "react";

// CSS
import styles from "@/styles/dashboard/client/ClientBookingsTable.module.css";

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
import { CalendarClock } from "lucide-react";

// Components
import { StatusBadge } from "@/components/dashboard/artist/bookings/StatusBadge";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { ClientScheduleSheet } from "@/components/dashboard/client/ClientScheduleSheet";

// Libs
import { DEPOSIT_META, PAYMENT_STATUS_META } from "@/constants/bookings";
import { getInquiryStatusMeta, describePiece } from "@/lib/bookings";
import {
  findLatestPayment,
  findPayablePayment,
  isAwaitingSchedule,
} from "@/lib/clientInquiries";
import { formatPrice, formatRelativeDate } from "@/lib/formatters";

// Types
import type { ClientInquiry } from "@/types/bookings";

interface ClientBookingsTableProps {
  inquiries: ClientInquiry[];
  onScheduled: () => void;
}

const DEFAULT_PAGE_SIZE = 10;

export const ClientBookingsTable = ({
  inquiries,
  onScheduled,
}: ClientBookingsTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [scheduling, setScheduling] = useState<ClientInquiry | null>(null);
  const [prevList, setPrevList] = useState(inquiries);
  if (inquiries !== prevList) {
    setPrevList(inquiries);
    setPage(1);
  }

  if (inquiries.length === 0) {
    return (
      <DashboardEmptyState
        icon={CalendarClock}
        title="No bookings yet"
        description="When you request a booking with an artist on Inkspace, it will show up here so you can track its status and pay any deposits."
      />
    );
  }

  const totalPages = Math.ceil(inquiries.length / pageSize);
  const currentPage = Math.min(page, totalPages);
  const rows = inquiries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <>
      <div className={styles.tableCard}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artist</TableHead>
              <TableHead>Piece</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((inquiry) => {
              const awaiting = isAwaitingSchedule(inquiry);
              const status = awaiting
                ? { label: "Action needed", variant: "warning" as const }
                : getInquiryStatusMeta(inquiry);
                
              return (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    {inquiry.artistSlug ? (
                      <Link
                        href={`/@${inquiry.artistSlug}`}
                        className={styles.artistLink}
                      >
                        {inquiry.artistName || "Your artist"}
                      </Link>
                    ) : (
                      <span className={styles.artistName}>
                        {inquiry.artistName || "Your artist"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className={styles.piece}>
                    {describePiece(inquiry)}
                  </TableCell>
                  <TableCell className={styles.requested}>
                    {formatRelativeDate(inquiry.createdAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      label={status.label}
                      variant={status.variant}
                    />
                  </TableCell>
                  <TableCell>
                    <PaymentCell
                      inquiry={inquiry}
                      awaiting={awaiting}
                      onPickTime={() => setScheduling(inquiry)}
                    />
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
        totalItems={inquiries.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      <ClientScheduleSheet
        inquiry={scheduling}
        onClose={() => setScheduling(null)}
        onScheduled={onScheduled}
      />
    </>
  );
};

const PaymentCell = ({
  inquiry,
  awaiting,
  onPickTime,
}: {
  inquiry: ClientInquiry;
  awaiting: boolean;
  onPickTime: () => void;
}) => {
  if (awaiting) {
    return (
      <Button size="sm" className={styles.pickTimeBtn} onClick={onPickTime}>
        Pick a time
      </Button>
    );
  }

  const payable = findPayablePayment(inquiry);
  if (payable) {
    return (
      <Button
        size="sm"
        nativeButton={false}
        render={<Link href={`/pay/${payable.publicToken}`} />}
      >
        Pay {formatPrice(payable.clientChargeCents, payable.currency)}
      </Button>
    );
  }

  const latestPayment = findLatestPayment(inquiry);
  if (latestPayment) {
    const meta = PAYMENT_STATUS_META[latestPayment.status];
    return <StatusBadge label={meta.label} variant={meta.variant} />;
  }

  const deposit = DEPOSIT_META[inquiry.depositStatus];
  return <StatusBadge label={deposit.label} variant={deposit.variant} />;
};
