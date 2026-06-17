"use client";

// Next.js
import { useState } from "react";
import Link from "next/link";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

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
import { PanelRightOpen, Zap } from "lucide-react";

// Components
import { StatusBadge } from "./StatusBadge";

// Libs
import { DEPOSIT_META, TYPE_LABELS, WAIVER_META } from "@/constants/bookings";
import {
  getInquiryActionItems,
  getInquiryStatusMeta,
  requestMeta,
} from "@/lib/bookings";
import { formatLocation, formatRelativeDate } from "@/lib/formatters";

// Types
import type { Inquiry } from "@/types/bookings";

interface BookingsTableProps {
  inquiries: Inquiry[];
  onSelect: (inquiry: Inquiry) => void;
  onOpenActions: (inquiry: Inquiry) => void;
}

const DEFAULT_PAGE_SIZE = 10;

export const BookingsTable = ({
  inquiries,
  onSelect,
  onOpenActions,
}: BookingsTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [prevList, setPrevList] = useState(inquiries);
  if (inquiries !== prevList) {
    setPrevList(inquiries);
    setPage(1);
  }

  if (inquiries.length === 0) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.emptyState}>
          <span className={styles.emptyTitle}>No booking requests yet</span>
          <span className={styles.emptyText}>
            Share your booking link and inquiries will land here.
          </span>
        </div>
      </div>
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
              <TableHead>Client</TableHead>
              <TableHead>Request</TableHead>
              <TableHead>Studio</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deposit</TableHead>
              <TableHead>Waiver</TableHead>
              <TableHead aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((inquiry) => {
              const status = getInquiryStatusMeta(inquiry);
              const deposit = DEPOSIT_META[inquiry.depositStatus];
              const waiver = WAIVER_META[inquiry.waiverStatus];
              return (
                <TableRow
                  key={inquiry.id}
                  className={styles.row}
                  onClick={() => onSelect(inquiry)}
                >
                  <TableCell>
                    <div className={styles.clientName}>
                      {inquiry.clientName}
                    </div>
                    <Link
                      href={`mailto:${inquiry.clientEmail}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.clientEmail}
                      onClick={(event) => event.stopPropagation()}
                    >
                      {inquiry.clientEmail}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className={styles.requestType}>
                      {TYPE_LABELS[inquiry.type]}
                    </div>
                    <div className={styles.requestMeta}>
                      {requestMeta(inquiry)}
                    </div>
                  </TableCell>
                  <TableCell className={styles.location}>
                    {inquiry.location ? formatLocation(inquiry.location) : "—"}
                  </TableCell>
                  <TableCell className={styles.submitted}>
                    {formatRelativeDate(inquiry.createdAt)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      label={status.label}
                      variant={status.variant}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      label={deposit.label}
                      variant={deposit.variant}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      label={waiver.label}
                      variant={waiver.variant}
                    />
                  </TableCell>
                  <TableCell className={styles.actionsCell}>
                    <div className={styles.rowActions}>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={getInquiryActionItems(inquiry).length === 0}
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpenActions(inquiry);
                        }}
                      >
                        <Zap size={15} />
                        Actions
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className={styles.viewBtn}
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelect(inquiry);
                        }}
                      >
                        <PanelRightOpen size={15} />
                        View
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
        totalItems={inquiries.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </>
  );
};
