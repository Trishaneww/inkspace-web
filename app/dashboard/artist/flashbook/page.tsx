"use client";

// Next.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// CSS
import styles from "@/styles/dashboard/artist/Flashbook.module.css";

// Components
import { FlashbookHeader } from "@/components/dashboard/artist/flash/FlashbookHeader";
import { FlashbookStats } from "@/components/dashboard/artist/flash/FlashbookStats";
import { FlashbookFilters } from "@/components/dashboard/artist/flash/FlashbookFilters";
import { FlashCard } from "@/components/dashboard/artist/flash/FlashCard";
import { AddFlashCard } from "@/components/dashboard/artist/flash/AddFlashCard";
import { FlashFormSheet } from "@/components/dashboard/artist/flash/FlashFormSheet";

// Libs
import { flashesApi } from "@/lib/api/flashes";
import { useAuth } from "@/lib/auth";
import {
  getFlashStats,
  filterFlashes,
  EMPTY_FLASH_FILTERS,
  type FlashFilters,
} from "@/lib/flashes";
import type { Flash } from "@/types/flash";

export default function ArtistFlashbookPage() {
  const { token } = useAuth();

  const [flashes, setFlashes] = useState<Flash[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FlashFilters>(EMPTY_FLASH_FILTERS);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingFlash, setEditingFlash] = useState<Flash | null>(null);

  const lastFetchKey = useRef<string | null>(null);

  const fetchFlashes = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await flashesApi.listForCurrentUser(token, {
        limit: 100,
      });
      setFlashes(result.items);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load flashes",
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (lastFetchKey.current === token) return;
    lastFetchKey.current = token;
    queueMicrotask(fetchFlashes);
  }, [fetchFlashes, token]);

  const stats = useMemo(() => getFlashStats(flashes), [flashes]);
  const visibleFlashes = useMemo(
    () => filterFlashes(flashes, filters),
    [flashes, filters],
  );

  const updateFilters = (patch: Partial<FlashFilters>) =>
    setFilters((current) => ({ ...current, ...patch }));

  const resetFilters = () => setFilters(EMPTY_FLASH_FILTERS);

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
      <FlashbookHeader />
      <FlashbookStats stats={stats} />
      <FlashbookFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={resetFilters}
        onAddFlash={openNewFlashSheet}
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
          {visibleFlashes.map((flash) => (
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
