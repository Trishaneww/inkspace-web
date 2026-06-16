"use client";

// Next.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// Components
import { BookingsStats } from "@/components/dashboard/artist/bookings/BookingsStats";
import { BookingsFilters } from "@/components/dashboard/artist/bookings/BookingsFilters";
import { BookingsTable } from "@/components/dashboard/artist/bookings/BookingsTable";
import { OpenBookPanel } from "@/components/dashboard/artist/bookings/OpenBookPanel";
import { OpenBookEditSheet } from "@/components/dashboard/artist/bookings/OpenBookEditSheet";
import { InquiryDetailSheet } from "@/components/dashboard/artist/bookings/InquiryDetailSheet";

// Libs
import { bookingsApi } from "@/lib/api/bookings";
import { openBookApi } from "@/lib/api/openBook";
import { useArtistSettings } from "@/hooks/useArtistSettings";
import { useAuth } from "@/lib/auth";
import { EMPTY_BOOKING_FILTERS } from "@/constants/bookings";
import { filterInquiries } from "@/lib/bookings";
import type { BookingFilters } from "@/types/bookings";
import type { BookingStats, Inquiry, OpenBook } from "@/types/bookings";
import { isLocalEnv } from "@/constants/env";

const EMPTY_STATS: BookingStats = {
  newInquiries: 0,
  awaitingDeposit: 0,
  bookedThisMonth: 0,
};

export default function ArtistBookingsPage() {
  const { token } = useAuth();
  const settings = useArtistSettings();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedInquiryId = searchParams.get("inquiry");

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<BookingStats>(EMPTY_STATS);
  const [openBook, setOpenBook] = useState<OpenBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [filters, setFilters] = useState<BookingFilters>(EMPTY_BOOKING_FILTERS);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const lastFetchKey = useRef<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const [list, book] = await Promise.all([
        bookingsApi.list(token),
        openBookApi.get(token).catch(() => null),
      ]);
      setInquiries(list.inquiries);
      setStats(list.stats);
      if (book) setOpenBook(book);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load bookings",
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

  const visibleInquiries = useMemo(
    () => filterInquiries(inquiries, filters),
    [inquiries, filters],
  );

  const updateFilters = (patch: Partial<BookingFilters>) =>
    setFilters((current) => ({ ...current, ...patch }));

  const handleSeed = async () => {
    if (!token) return;
    setIsSeeding(true);
    try {
      await bookingsApi.devSeed(token);
      await fetchData();
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Seeding failed");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCreateBooking = () => {};

  const initialView =
    searchParams.get("view") === "actions" ? "actions" : "details";

  const openInquiry = (
    inquiry: Inquiry,
    intent: "details" | "actions" = "details",
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("inquiry", inquiry.id);
    if (intent === "actions") params.set("view", "actions");
    else params.delete("view");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const closeInquiry = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("inquiry");
    params.delete("view");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div className={styles.bookingsPage}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Bookings</h1>
        <span className={styles.headerSubtitle}>
          Review and manage incoming booking requests
        </span>
      </div>

      {openBook && settings.data && (
        <OpenBookPanel
          slug={openBook.slug}
          acceptingBookings={settings.data.settings.acceptingBookings}
          onEdit={() => setIsEditOpen(true)}
        />
      )}

      <BookingsStats stats={stats} />

      <BookingsFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={() => setFilters(EMPTY_BOOKING_FILTERS)}
        onCreateBooking={handleCreateBooking}
        onSeed={isLocalEnv ? handleSeed : undefined}
        isSeeding={isSeeding}
      />

      {loadError && <div className={styles.errorBanner}>{loadError}</div>}

      {!isLoading && (
        <BookingsTable
          inquiries={visibleInquiries}
          onSelect={openInquiry}
          onOpenActions={(inquiry) => openInquiry(inquiry, "actions")}
        />
      )}

      <InquiryDetailSheet
        inquiryId={selectedInquiryId}
        onClose={closeInquiry}
        onActed={fetchData}
        initialView={initialView}
      />

      <OpenBookEditSheet
        open={isEditOpen}
        openBook={openBook}
        controller={settings}
        onOpenChange={setIsEditOpen}
        onOpenBookSaved={(updated) => setOpenBook(updated)}
      />
    </div>
  );
}
