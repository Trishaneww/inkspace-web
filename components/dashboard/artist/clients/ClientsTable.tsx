"use client";

// Next.js
import { useState } from "react";
import Link from "next/link";

// CSS
import styles from "@/styles/dashboard/artist/Clients.module.css";

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
import { PanelRightOpen } from "lucide-react";

// Components
import { InitialsAvatar } from "@/components/common/InitialsAvatar";
import { StatusBadge } from "@/components/dashboard/artist/bookings/StatusBadge";

// Libs
import { formatPhone, formatPrice, formatRelativeDate } from "@/lib/formatters";
import {
  buildClientRelationship,
  buildClientTouchUp,
} from "@/lib/clients/clientStatus";

// Types
import type { Client } from "@/types/clients";

interface ClientsTableProps {
  clients: Client[];
  onViewBookings: (client: Client) => void;
}

const DEFAULT_PAGE_SIZE = 10;

export const ClientsTable = ({
  clients,
  onViewBookings,
}: ClientsTableProps) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [prevList, setPrevList] = useState(clients);
  if (clients !== prevList) {
    setPrevList(clients);
    setPage(1);
  }

  if (clients.length === 0) {
    return (
      <div className={styles.tableCard}>
        <div className={styles.emptyState}>
          <span className={styles.emptyTitle}>No clients yet</span>
          <span className={styles.emptyText}>
            Clients appear here once they send you a booking request.
          </span>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(clients.length / pageSize);
  const currentPage = Math.min(page, totalPages);
  const rows = clients.slice(
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
              <TableHead>Phone</TableHead>
              <TableHead>Relationship</TableHead>
              <TableHead>Touch-up</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Last activity</TableHead>
              <TableHead>Total paid</TableHead>
              <TableHead aria-label="Actions" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((client) => {
              const relationship = buildClientRelationship(client);
              const touchUp = buildClientTouchUp(client);
              return (
                <TableRow key={client.email}>
                  <TableCell>
                    <div className={styles.clientCell}>
                      <InitialsAvatar name={client.name} seed={client.email} />
                      <div className={styles.clientText}>
                        <div className={styles.clientName}>{client.name}</div>
                        <Link
                          href={`mailto:${client.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.clientEmail}
                        >
                          {client.email}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={styles.phone}>
                    {client.phone ? formatPhone(client.phone) : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      label={relationship.label}
                      variant={relationship.variant}
                    />
                  </TableCell>
                  <TableCell>
                    {touchUp ? (
                      <div className={styles.touchUp}>
                        <StatusBadge
                          label={touchUp.meta.label}
                          variant={touchUp.meta.variant}
                        />
                        {touchUp.dateLabel && (
                          <span className={styles.touchUpDate}>
                            {touchUp.dateLabel}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className={styles.muted}>—</span>
                    )}
                  </TableCell>
                  <TableCell className={styles.bookings}>
                    {client.bookingsCount}
                  </TableCell>
                  <TableCell className={styles.lastActivity}>
                    {formatRelativeDate(client.lastActivityAt)}
                  </TableCell>
                  <TableCell className={styles.totalPaid}>
                    {client.totalPaidCents > 0 ? (
                      formatPrice(client.totalPaidCents, client.currency)
                    ) : (
                      <span className={styles.muted}>—</span>
                    )}
                  </TableCell>
                  <TableCell className={styles.actionsCell}>
                    <div className={styles.rowActions}>
                      <Button
                        type="button"
                        size="sm"
                        className={styles.viewBtn}
                        onClick={() => onViewBookings(client)}
                      >
                        <PanelRightOpen size={15} />
                        View bookings
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
        totalItems={clients.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </>
  );
};
