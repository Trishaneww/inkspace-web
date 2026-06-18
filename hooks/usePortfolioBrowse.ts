"use client";

// Next.js
import { useEffect, useMemo, useRef, useState } from "react";

// Libs
import { portfolioApi } from "@/lib/api/portfolio";
import { PortfolioBrowsePhase } from "@/types/portfolioBrowse";

// Types
import type { PortfolioItem } from "@/types/portfolio";

const PORTFOLIO_ERROR = "Couldn't load the portfolio. Please try again.";

export const usePortfolioBrowse = (
  artistId: string,
  onOpenChange: (open: boolean) => void,
) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requested = useRef(false);

  const [phase, setPhase] = useState<PortfolioBrowsePhase>(
    PortfolioBrowsePhase.Grid,
  );
  const [selectedId, setSelectedId] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    portfolioApi
      .listByArtist(artistId)
      .then((result) => setItems(result.items))
      .catch(() => setError(PORTFOLIO_ERROR))
      .finally(() => setLoading(false));
  }, [artistId]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  const selectItem = (itemId: string) => {
    setSelectedId(itemId);
    setActiveImageIndex(0);
    setPhase(PortfolioBrowsePhase.Detail);
  };

  const close = () => onOpenChange(false);

  const goBack = () => {
    if (phase === PortfolioBrowsePhase.Detail) {
      setPhase(PortfolioBrowsePhase.Grid);
      return;
    }
    close();
  };

  return {
    phase,
    items,
    loading,
    error,
    selectedItem,
    selectedId,
    activeImageIndex,
    selectItem,
    setActiveImageIndex,
    goBack,
    close,
  };
};
