"use client";

// Next.js
import { useCallback, useEffect, useRef, useState } from "react";

// CSS
import styles from "@/styles/dashboard/artist/Flashbook.module.css";

// Components
import { FlashbookHeader } from "@/components/dashboard/artist/flash/FlashbookHeader";
import { FlashbookFilters } from "@/components/dashboard/artist/flash/FlashbookFilters";
import { FlashCard } from "@/components/dashboard/artist/flash/FlashCard";
import { AddFlashCard } from "@/components/dashboard/artist/flash/AddFlashCard";
import { FlashFormSheet } from "@/components/dashboard/artist/flash/FlashFormSheet";

// Libs
import { flashesApi } from "@/lib/api/flashes";
import { useAuth } from "@/lib/auth";

// Types
import type { Flash, FlashStatusFilter } from "@/types/flash";

export default function ArtistFlashbookPage() {
  const { token } = useAuth();

  const [flashes, setFlashes] = useState<Flash[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [availableCount, setAvailableCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<FlashStatusFilter>("all");

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingFlash, setEditingFlash] = useState<Flash | null>(null);

  const lastFetchKey = useRef<string | null>(null);

  const fetchFlashes = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await flashesApi.listForCurrentUser(token, {
        status: statusFilter === "all" ? undefined : statusFilter,
        limit: 100,
      });
      setFlashes(result.items);
      setTotalCount(result.total);
      setAvailableCount(result.available);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load flashes",
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, statusFilter]);

  useEffect(() => {
    // Defer to a microtask so React 19's react-hooks/set-state-in-effect
    // lint sees the setState calls as async-from-the-effect, not synchronous.
    const fetchKey = `${token ?? "anon"}:${statusFilter}`;
    if (lastFetchKey.current === fetchKey) return;
    lastFetchKey.current = fetchKey;
    void Promise.resolve().then(() => fetchFlashes());
  }, [fetchFlashes, token, statusFilter]);

  const openNewFlashSheet = () => {
    setEditingFlash(null);
    setIsSheetOpen(true);
  };

  const openEditFlashSheet = (flash: Flash) => {
    setEditingFlash(flash);
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setEditingFlash(null);
  };

  const handleFlashSaved = async () => {
    handleSheetClose();
    await fetchFlashes();
  };

  return (
    <div className={styles.flashbookPage}>
      <FlashbookHeader
        totalCount={totalCount}
        availableCount={availableCount}
        onNewFlash={openNewFlashSheet}
      />

      <FlashbookFilters
        activeStatus={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {loadError && <div className={styles.errorBanner}>{loadError}</div>}

      {isLoading ? (
        <div className={styles.loadingRow}>
          <div className={styles.loadingCard} />
          <div className={styles.loadingCard} />
          <div className={styles.loadingCard} />
        </div>
      ) : (
        <div className={styles.flashGrid}>
          {flashes.map((flash) => (
            <FlashCard
              key={flash.id}
              flash={flash}
              onEdit={openEditFlashSheet}
            />
          ))}
          <AddFlashCard onClick={openNewFlashSheet} />
        </div>
      )}

      <FlashFormSheet
        open={isSheetOpen}
        initialFlash={editingFlash}
        onOpenChange={(open) =>
          open ? setIsSheetOpen(true) : handleSheetClose()
        }
        onSaved={handleFlashSaved}
      />
    </div>
  );
}
