// CSS
import styles from "@/styles/dashboard/artist/StatsRow.module.css";

// Types
import type { LucideIcon } from "lucide-react";

export interface StatCard {
  key: string;
  label: string;
  value: number;
  icon: LucideIcon;
}

interface StatsRowProps {
  cards: StatCard[];
}

export const StatsRow = ({ cards }: StatsRowProps) => {
  return (
    <div className={styles.stats} data-count={cards.length}>
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
