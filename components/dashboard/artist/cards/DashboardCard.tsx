// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/DashboardCards.module.css";

// Types
import type { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const DashboardCard = ({
  title,
  icon: Icon,
  action,
  className,
  children,
}: DashboardCardProps) => (
  <section className={clsx(styles.card, className)}>
    <div className={styles.cardHeader}>
      <div className={styles.cardHeading}>
        <span className={styles.cardIcon}>
          <Icon size={16} strokeWidth={2} />
        </span>
        <span className={styles.cardTitle}>{title}</span>
      </div>
      {action}
    </div>
    {children}
  </section>
);
