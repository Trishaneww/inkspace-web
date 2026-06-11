// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/StatusBadge.module.css";

// Libs
import type { BadgeVariant } from "@/types/bookings";

interface StatusBadgeProps {
  label: string;
  variant: BadgeVariant;
}

export const StatusBadge = ({ label, variant }: StatusBadgeProps) => (
  <span className={clsx(styles.badge, styles[variant])}>{label}</span>
);
