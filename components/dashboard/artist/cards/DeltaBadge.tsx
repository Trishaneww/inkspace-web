// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/DashboardCards.module.css";

// HTML Components
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

// Types
import type { DeltaResult } from "@/lib/dashboard/greeting";

interface DeltaBadgeProps {
  delta: DeltaResult;
}

export const DeltaBadge = ({ delta }: DeltaBadgeProps) => {
  if (delta.type === "none") return null;

  if (delta.type === "new") {
    return <span className={clsx(styles.delta, styles.deltaNew)}>New</span>;
  }

  const positive = delta.percent >= 0;
  const Arrow = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={clsx(
        styles.delta,
        positive ? styles.deltaUp : styles.deltaDown,
      )}
    >
      {positive ? "+" : ""}
      {delta.percent}%
      <Arrow size={13} strokeWidth={2.5} className={styles.deltaArrow} />
    </span>
  );
};
