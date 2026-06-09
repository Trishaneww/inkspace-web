"use client";

// CSS
import styles from "@/styles/dashboard/artist/Portfolio.module.css";

// HTML Components
import { CheckCircle2, LayoutGrid, Palette } from "lucide-react";

// Libs
import type { PortfolioStats as PortfolioStatsData } from "@/lib/portfolio";

interface PortfolioStatsProps {
  stats: PortfolioStatsData;
}

export const PortfolioStats = ({ stats }: PortfolioStatsProps) => {
  const cards = [
    {
      key: "total",
      label: "Total pieces",
      value: stats.total,
      icon: LayoutGrid,
    },
    {
      key: "published",
      label: "Published",
      value: stats.published,
      icon: CheckCircle2,
    },
    {
      key: "styles",
      label: "Styles covered",
      value: stats.styles,
      icon: Palette,
    },
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
