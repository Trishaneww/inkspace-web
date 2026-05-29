"use client";

// CSS
import styles from "@/styles/dashboard/artist/Flashbook.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { EyeIcon, PlusIcon } from "lucide-react";

interface FlashbookHeaderProps {
  totalCount: number;
  availableCount: number;
  onPreview?: () => void;
  onNewFlash: () => void;
}

export const FlashbookHeader = ({
  totalCount,
  availableCount,
  onPreview,
  onNewFlash,
}: FlashbookHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.headerTitle}>Flashbook</h1>
        <span className={styles.flashCounts}>
          {totalCount} {totalCount === 1 ? "design" : "designs"} ·{" "}
          {availableCount} available
        </span>
      </div>

      <div className={styles.headerActions}>
        <Button
          variant="outline"
          className={styles.previewFlashBtn}
          onClick={onPreview}
        >
          <EyeIcon className={styles.btnIcon} />
          Preview
        </Button>
        <Button className={styles.addFlashBtn} onClick={onNewFlash}>
          <PlusIcon className={styles.btnIcon} />
          New flash
        </Button>
      </div>
    </div>
  );
};
