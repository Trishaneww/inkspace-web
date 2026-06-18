"use client";

// Next.js
import Image from "next/image";

// CSS
import styles from "@/styles/book/PortfolioBrowse.module.css";

// HTML Components
import { Loader2 } from "lucide-react";

// Libs
import type { PortfolioItem } from "@/types/portfolio";

interface PortfolioGridPhaseProps {
  items: PortfolioItem[];
  loading: boolean;
  error: string | null;
  onSelect: (itemId: string) => void;
}

export const PortfolioGridPhase = ({
  items,
  loading,
  error,
  onSelect,
}: PortfolioGridPhaseProps) => {
  if (loading) {
    return (
      <div className={styles.state}>
        <Loader2 size={22} className="animate-spin" />
      </div>
    );
  }
  if (error) {
    return <div className={styles.state}>{error}</div>;
  }
  if (items.length === 0) {
    return (
      <div className={styles.state}>
        No portfolio pieces are available right now.
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {items.map((item) => {
        const cover = item.imageUrls[0];

        return (
          <button
            key={item.id}
            type="button"
            className={styles.tile}
            onClick={() => onSelect(item.id)}
            aria-label={item.title}
          >
            {cover ? (
              <Image
                src={cover}
                alt={item.title}
                fill
                unoptimized
                className={styles.tileImage}
              />
            ) : (
              <span className={styles.tilePlaceholder}>{item.title}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
