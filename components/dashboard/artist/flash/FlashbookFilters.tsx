"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Flashbook.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// Libs
import type { FlashStatusFilter } from "@/types/flash";
import { FILTER_OPTIONS } from "@/constants/flashes";

interface FlashbookFiltersProps {
  activeStatus: FlashStatusFilter;
  onStatusChange: (next: FlashStatusFilter) => void;
}

export const FlashbookFilters = ({
  activeStatus,
  onStatusChange,
}: FlashbookFiltersProps) => {
  return (
    <div className={styles.filters}>
      <div className={styles.filterOptions}>
        {FILTER_OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            variant="ghost"
            className={clsx(styles.option, {
              [styles.active]: activeStatus === option.value,
            })}
            onClick={() => onStatusChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <Button type="button" variant="ghost" className={styles.sortFlashBtn}>
        <ArrowUpDown size={14} />
        Recent
      </Button>
    </div>
  );
};
