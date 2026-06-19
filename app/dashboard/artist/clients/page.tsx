"use client";

// Next.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// CSS
import styles from "@/styles/dashboard/artist/Clients.module.css";

// Components
import { ClientsFilters } from "@/components/dashboard/artist/clients/ClientsFilters";
import { ClientsTable } from "@/components/dashboard/artist/clients/ClientsTable";

// Libs
import { bookingsApi } from "@/lib/api/bookings";
import { useAuth } from "@/lib/auth";
import { deriveClients } from "@/lib/clients/deriveClients";
import { filterClients } from "@/lib/clients/filterClients";
import { EMPTY_CLIENT_FILTERS } from "@/constants/clients";

// Types
import type { Inquiry } from "@/types/bookings";
import type { Client, ClientFilters } from "@/types/clients";

export default function ArtistClientsPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClientFilters>(EMPTY_CLIENT_FILTERS);

  const lastFetchKey = useRef<string | null>(null);

  const fetchClients = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const list = await bookingsApi.list(token);
      setInquiries(list.inquiries);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load clients",
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (lastFetchKey.current === token) return;
    lastFetchKey.current = token;
    queueMicrotask(fetchClients);
  }, [fetchClients, token]);

  const clients = useMemo(() => deriveClients(inquiries), [inquiries]);
  const visibleClients = useMemo(
    () => filterClients(clients, filters),
    [clients, filters],
  );

  const updateFilters = (patch: Partial<ClientFilters>) =>
    setFilters((current) => ({ ...current, ...patch }));

  const viewClientBookings = (client: Client) => {
    const params = new URLSearchParams({ search: client.email });
    router.push(`/dashboard/artist/bookings?${params.toString()}`);
  };

  return (
    <div className={styles.clientsPage}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Clients</h1>
        <span className={styles.headerSubtitle}>
          Find anyone who has booked or reached out to you
        </span>
      </div>

      <ClientsFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={() => setFilters(EMPTY_CLIENT_FILTERS)}
      />

      {loadError && <div className={styles.errorBanner}>{loadError}</div>}

      {!isLoading && (
        <ClientsTable
          clients={visibleClients}
          onViewBookings={viewClientBookings}
        />
      )}
    </div>
  );
}
