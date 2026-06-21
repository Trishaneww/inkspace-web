"use client";

// Next.js
import Link from "next/link";
import { useState } from "react";

// Hooks
import { useSlideTransition } from "@/hooks/useSlideTransition";

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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CalendarClock } from "lucide-react";

// Components
import { StatusBadge } from "@/components/dashboard/artist/bookings/StatusBadge";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { ScheduleForm } from "@/components/dashboard/client/ClientScheduleSheet";
import { PayForm } from "@/components/dashboard/client/ClientPaySheet";

// Libs
import { DEPOSIT_META, PAYMENT_STATUS_META } from "@/constants/bookings";
import { getInquiryStatusMeta, describePiece } from "@/lib/bookings";
import {
  findLatestPayment,
  findPayablePayment,
  isAwaitingSchedule,
} from "@/lib/clientInquiries";
import { formatRelativeDate } from "@/lib/formatters";
import { displayToast } from "@/lib/toast";

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
  const [flow, setFlow] = useState<{
    mode: "schedule" | "pay";
    inquiry: ClientInquiry;
  } | null>(null);
  const [prevList, setPrevList] = useState(inquiries);
  if (inquiries !== prevList) {
    setPrevList(inquiries);
    setPage(1);
  }

  const slideRef = useSlideTransition<HTMLDivElement>(
    flow?.mode === "pay" ? 1 : 0,
  );

  const handleScheduled = (updated: ClientInquiry) => {
    onScheduled();
    if (findPayablePayment(updated)) {
      setFlow({ mode: "pay", inquiry: updated });
    } else {
      setFlow(null);
      displayToast("Your time is booked", "success");
    }
  };

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
              <TableHead aria-label="Actions" />
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
                    <PaymentBadge inquiry={inquiry} />
                  </TableCell>
                  <TableCell className={styles.actionsCell}>
                    <ActionCell
                      inquiry={inquiry}
                      awaiting={awaiting}
                      onPickTime={() => setFlow({ mode: "schedule", inquiry })}
                      onPay={() => setFlow({ mode: "pay", inquiry })}
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

      <Sheet
        open={!!flow}
        onOpenChange={(open) => {
          if (!open) setFlow(null);
        }}
      >
        <SheetContent side="right" className={styles.flowSheet} showCloseButton>
          <div ref={slideRef} className={styles.flowBody}>
            {flow?.mode === "schedule" && (
              <ScheduleForm
                key={flow.inquiry.id}
                inquiry={flow.inquiry}
                onClose={() => setFlow(null)}
                onScheduled={handleScheduled}
              />
            )}
            {flow?.mode === "pay" && (
              <PayForm
                key={flow.inquiry.id}
                inquiry={flow.inquiry}
                onClose={() => setFlow(null)}
                onChangeTime={(inquiry) =>
                  setFlow({ mode: "schedule", inquiry })
                }
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

// The Payment column always shows a status badge — the latest payment's state,
// or the booking's deposit status when no payment exists yet. "processing" (a
// checkout that was opened but not completed) reads as "Requested" to the client,
// since nothing has actually been charged until the payment clears.
const PaymentBadge = ({ inquiry }: { inquiry: ClientInquiry }) => {
  const latestPayment = findLatestPayment(inquiry);
  if (!latestPayment) {
    const deposit = DEPOSIT_META[inquiry.depositStatus];
    return <StatusBadge label={deposit.label} variant={deposit.variant} />;
  }
  const status =
    latestPayment.status === "processing" ? "requested" : latestPayment.status;
  const meta = PAYMENT_STATUS_META[status];
  return <StatusBadge label={meta.label} variant={meta.variant} />;
};

// The Actions column holds the row's one actionable button — schedule or pay —
// and falls back to a muted dash when nothing is needed.
const ActionCell = ({
  inquiry,
  awaiting,
  onPickTime,
  onPay,
}: {
  inquiry: ClientInquiry;
  awaiting: boolean;
  onPickTime: () => void;
  onPay: () => void;
}) => {
  // A payable deposit/balance opens the review/pay step (which offers "Change
  // time" for client-scheduled bookings); otherwise an unpicked slot opens the
  // time picker.
  const payable = findPayablePayment(inquiry);
  if (payable || awaiting) {
    return (
      <Button
        size="sm"
        className={styles.payBtn}
        onClick={payable ? onPay : onPickTime}
      >
        Complete booking
      </Button>
    );
  }

  return <span className={styles.noAction}>—</span>;
};
