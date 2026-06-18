// CSS
import styles from "@/styles/dashboard/DashboardEmptyState.module.css";

// HTML Components
import type { LucideIcon } from "lucide-react";

interface DashboardEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const DashboardEmptyState = ({
  icon: Icon,
  title,
  description,
  children,
}: DashboardEmptyStateProps) => (
  <div className={styles.card}>
    <div className={styles.inner}>
      <div className={styles.iconTile}>
        <Icon className={styles.icon} aria-hidden />
      </div>

      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>

      {children && <div className={styles.actions}>{children}</div>}
    </div>
  </div>
);
