// CSS
import styles from "@/styles/dashboard/artist/DashboardCards.module.css";

// Libs
import { formatPrice } from "@/lib/formatters";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string | number;
  currency: string;
}

export const ChartTooltip = ({
  active,
  payload,
  label,
  currency,
}: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0]?.value ?? 0);
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{label}</span>
      <span className={styles.tooltipValue}>
        {formatPrice(Math.round(value * 100), currency)}
      </span>
    </div>
  );
};
