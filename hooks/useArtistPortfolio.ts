"use client";

// Next.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Libs
import { portfolioApi } from "@/lib/api/portfolio";
import { useAuth } from "@/lib/auth";
import {
  filterPortfolioItems,
  getPortfolioStats,
  type PortfolioFilters as Filters,
} from "@/lib/portfolio";
import type { PortfolioItem } from "@/types/portfolio";
import { EMPTY_PORTFOLIO_FILTERS } from "@/constants/portfolio";

export function useArtistPortfolio() {
  const { token } = useAuth();

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>(EMPTY_PORTFOLIO_FILTERS);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  const lastFetchKey = useRef<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await portfolioApi.listForCurrentUser(token, {
        limit: 100,
      });
      setItems(result.items);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load portfolio",
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (lastFetchKey.current === token) return;
    lastFetchKey.current = token;
    queueMicrotask(fetchItems);
  }, [fetchItems, token]);

  const stats = useMemo(() => getPortfolioStats(items), [items]);
  const visibleItems = useMemo(
    () => filterPortfolioItems(items, filters),
    [items, filters],
  );

  const updateFilters = (patch: Partial<Filters>) =>
    setFilters((current) => ({ ...current, ...patch }));

  const openNewSheet = () => {
    setEditingItem(null);
    setIsSheetOpen(true);
  };

  const openEditSheet = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setEditingItem(null);
  };

  const handleSaved = async () => {
    handleSheetClose();
    await fetchItems();
  };

  return {
    items,
    stats,
    visibleItems,
    isSheetOpen,
    editingItem,
    isLoading,
    loadError,
    filters,
    setFilters,
    updateFilters,
    openNewSheet,
    openEditSheet,
    handleSheetClose,
    setIsSheetOpen,
    handleSaved,
  };
}
