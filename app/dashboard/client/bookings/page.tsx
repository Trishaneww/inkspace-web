"use client";

// CSS
import styles from "@/styles/dashboard/client/ClientPage.module.css";

// HTML Components
import { Loader2 } from "lucide-react";

// Components
import { ClientBookingsTable } from "@/components/dashboard/client/ClientBookingsTable";

// Libs
import { useClientBookings } from "@/lib/clientBookingsContext";

export default function ClientBookingsPage() {
  const { inquiries, isLoading, error, refresh } = useClientBookings();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bookings & inquiries</h1>
        <span className={styles.subtitle}>
          Track the requests you have made and pay any deposits
        </span>
      </div>

      {error && <div className={styles.errorBanner}>{error}</div>}

      {isLoading ? (
        <div className={styles.loading}>
          <Loader2 size={22} className="animate-spin" />
        </div>
      ) : (
        <ClientBookingsTable inquiries={inquiries} onScheduled={refresh} />
      )}
    </div>
  );
}
