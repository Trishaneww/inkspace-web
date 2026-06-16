// CSS
import clsx from "clsx";
import styles from "@/styles/review/Review.module.css";

// Types
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export const ReviewCard = ({ children }: { children: ReactNode }) => (
  <div className={styles.card}>{children}</div>
);

interface ReviewRowProps {
  icon?: LucideIcon;
  leading?: ReactNode;
  children: ReactNode;
}

export const ReviewRow = ({
  icon: Icon,
  leading,
  children,
}: ReviewRowProps) => (
  <div className={styles.row}>
    {Icon ? <Icon size={16} className={styles.rowIcon} /> : leading}
    <span>{children}</span>
  </div>
);

export const ReviewSection = ({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) => (
  <div className={styles.section}>
    {label && <span className={styles.sectionLabel}>{label}</span>}
    <div className={styles.panel}>{children}</div>
  </div>
);

interface ReviewNoteProps {
  icon: LucideIcon;
  children: ReactNode;
}

export const ReviewNote = ({ icon: Icon, children }: ReviewNoteProps) => (
  <p className={styles.note}>
    <Icon size={15} className={styles.noteIcon} />
    <span>{children}</span>
  </p>
);

interface ReviewLineItemProps {
  label: string;
  value: string;
  note?: string;
  variant?: "total" | "muted";
}

export const ReviewLineItem = ({
  label,
  value,
  note,
  variant,
}: ReviewLineItemProps) => (
  <div
    className={clsx(styles.item, {
      [styles.itemTotal]: variant === "total",
      [styles.itemMuted]: variant === "muted",
    })}
  >
    <span className={styles.itemLabel}>
      {label}
      {note && <span className={styles.itemNote}>{note}</span>}
    </span>
    <span className={styles.itemValue}>{value}</span>
  </div>
);

export const ReviewChips = ({ items }: { items: string[] }) => (
  <div className={styles.chips}>
    {items.map((item) => (
      <span key={item} className={styles.chip}>
        {item}
      </span>
    ))}
  </div>
);

export const ReviewText = ({ children }: { children: ReactNode }) => (
  <p className={styles.text}>{children}</p>
);

interface ReviewTypeBoxProps {
  icon: LucideIcon;
  label: string;
  hint?: string;
  variant?: "default" | "destructive";
}

export const ReviewTypeBox = ({
  icon: Icon,
  label,
  hint,
  variant = "default",
}: ReviewTypeBoxProps) => (
  <div
    className={clsx(styles.typeBox, {
      [styles.typeBoxDestructive]: variant === "destructive",
    })}
  >
    <span className={styles.typeIcon}>
      <Icon size={16} />
    </span>
    <span className={styles.typeText}>
      <span className={styles.typeLabel}>{label}</span>
      {hint && <span className={styles.typeHint}>{hint}</span>}
    </span>
  </div>
);

interface ReviewWarningProps {
  icon: LucideIcon;
  children: ReactNode;
}

export const ReviewWarning = ({ icon: Icon, children }: ReviewWarningProps) => (
  <div className={styles.warning}>
    <Icon size={16} className={styles.warningIcon} />
    <span>{children}</span>
  </div>
);
