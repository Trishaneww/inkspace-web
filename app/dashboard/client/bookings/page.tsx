"use client";

// Next.js
import { useCallback, useEffect, useRef, useState } from "react";

// CSS
import styles from "@/styles/dashboard/client/ClientPage.module.css";

// HTML Components
import { Loader2 } from "lucide-react";

// Components
import { ClientBookingsTable } from "@/components/dashboard/client/ClientBookingsTable";

// Libs
import { clientInquiriesApi } from "@/lib/api/clientInquiries";
import { useAuth } from "@/lib/auth";
import type { ClientInquiry } from "@/types/bookings";

export default function ClientBookingsPage() {
  const { token } = useAuth();

  const [inquiries, setInquiries] = useState<ClientInquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const lastFetchKey = useRef<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await clientInquiriesApi.list(token);
      setInquiries(data.inquiries);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load your bookings",
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (lastFetchKey.current === token) return;
    lastFetchKey.current = token;
    queueMicrotask(fetchData);
  }, [fetchData, token]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bookings & inquiries</h1>
        <span className={styles.subtitle}>
          Track the requests you have made and pay any deposits
        </span>
      </div>

      {loadError && <div className={styles.errorBanner}>{loadError}</div>}

      {isLoading ? (
        <div className={styles.loading}>
          <Loader2 size={22} className="animate-spin" />
        </div>
      ) : (
        <ClientBookingsTable inquiries={inquiries} />
      )}
    </div>
  );
}
