"use client";

// CSS
import styles from "@/styles/dashboard/artist/Flashbook.module.css";

// HTML Components
import { Archive, BookmarkCheck, Eye, Sparkles } from "lucide-react";

// Libs
import type { FlashStats } from "@/lib/flashes";

interface FlashbookStatsProps {
  stats: FlashStats;
}

export const FlashbookStats = ({ stats }: FlashbookStatsProps) => {
  const cards = [
    {
      key: "available",
      label: "Available",
      value: stats.available,
      icon: Sparkles,
    },
    {
      key: "claimed",
      label: "Claimed",
      value: stats.claimed,
      icon: BookmarkCheck,
    },
    {
      key: "archived",
      label: "Archived",
      value: stats.archived,
      icon: Archive,
    },
    { key: "views", label: "Total views", value: stats.totalViews, icon: Eye },
  ];

  return (
    <div className={styles.stats}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>
                <Icon size={16} />
              </span>
              <span className={styles.statLabel}>{card.label}</span>
            </div>
            <span className={styles.statValue}>
              {card.value.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
};
