"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { ChevronRight, Loader2 } from "lucide-react";

// Types
import type { InquiryActionItem } from "@/types/bookings";

interface InquiryActionsPhaseProps {
  items: InquiryActionItem[];
  pendingActionKey: string | null;
  onSelect: (item: InquiryActionItem) => void;
}

export const InquiryActionsPhase = ({
  items,
  pendingActionKey,
  onSelect,
}: InquiryActionsPhaseProps) => {
  const primary = items.filter((item) => !item.destructive);
  const destructive = items.filter((item) => item.destructive);
  const disabled = pendingActionKey !== null;

  const renderCard = (item: InquiryActionItem) => (
    <button
      key={item.key}
      type="button"
      disabled={disabled}
      className={clsx(styles.actionCard, {
        [styles.actionCardDestructive]: item.destructive,
      })}
      onClick={() => onSelect(item)}
    >
      <span className={styles.actionCardIcon}>
        <item.icon size={18} />
      </span>
      <span className={styles.actionCardBody}>
        <span className={styles.actionCardTitle}>{item.label}</span>
        <span className={styles.actionCardDesc}>{item.description}</span>
      </span>
      {pendingActionKey === item.key ? (
        <Loader2
          size={18}
          className={clsx(styles.actionCardChevron, "animate-spin")}
        />
      ) : (
        <ChevronRight size={18} className={styles.actionCardChevron} />
      )}
    </button>
  );

  return (
    <div className={styles.actionList}>
      {primary.map(renderCard)}
      {destructive.length > 0 && primary.length > 0 && (
        <div className={styles.actionDivider} />
      )}
      {destructive.map(renderCard)}
    </div>
  );
};
