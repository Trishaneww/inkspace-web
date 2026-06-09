"use client";

// CSS
import styles from "@/styles/dashboard/artist/Portfolio.module.css";

// Components
import { PortfolioHeader } from "@/components/dashboard/artist/portfolio/PortfolioHeader";
import { PortfolioStats } from "@/components/dashboard/artist/portfolio/PortfolioStats";
import { PortfolioFilters } from "@/components/dashboard/artist/portfolio/PortfolioFilters";
import { PortfolioCard } from "@/components/dashboard/artist/portfolio/PortfolioCard";
import { AddPortfolioCard } from "@/components/dashboard/artist/portfolio/AddPortfolioCard";
import { PortfolioFormSheet } from "@/components/dashboard/artist/portfolio/PortfolioFormSheet";

// Hooks
import { useArtistPortfolio } from "@/hooks/useArtistPortfolio";

// Libs
import { EMPTY_PORTFOLIO_FILTERS } from "@/constants/portfolio";

export default function ArtistPortfolioPage() {
  const {
    stats,
    visibleItems,
    isSheetOpen,
    editingItem,
    isLoading,
    loadError,
    filters,
    setIsSheetOpen,
    setFilters,
    updateFilters,
    openNewSheet,
    openEditSheet,
    handleSheetClose,
    handleSaved,
  } = useArtistPortfolio();

  return (
    <div className={styles.portfolioPage}>
      <PortfolioHeader />
      <PortfolioStats stats={stats} />
      <PortfolioFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={() => setFilters(EMPTY_PORTFOLIO_FILTERS)}
        onAddItem={openNewSheet}
      />

      {loadError && <div className={styles.errorBanner}>{loadError}</div>}

      {isLoading ? (
        <div className={styles.loadingRow}>
          <div className={styles.loadingCard} />
          <div className={styles.loadingCard} />
          <div className={styles.loadingCard} />
        </div>
      ) : (
        <div className={styles.grid}>
          {visibleItems.map((item) => (
            <PortfolioCard key={item.id} item={item} onEdit={openEditSheet} />
          ))}
          <AddPortfolioCard onClick={openNewSheet} />
        </div>
      )}

      <PortfolioFormSheet
        open={isSheetOpen}
        initialItem={editingItem}
        onOpenChange={(open) =>
          open ? setIsSheetOpen(true) : handleSheetClose()
        }
        onSaved={handleSaved}
      />
    </div>
  );
}
