"use client";

// CSS
import styles from "@/styles/dashboard/artist/FlashFormSheet.module.css";

// Types
import { TierFormRow, type FlashSizeCode } from "@/types/flash";
import { FLASH_SIZE_OPTIONS } from "@/constants/flashes";
import { Checkbox } from "@/components/ui/checkbox";
import { DurationSelect } from "./DurationSelect";
import { PriceInput } from "./PricingInput";

interface PerSizePricingTableProps {
  tierRows: Record<FlashSizeCode, TierFormRow>;
  onChange: (code: FlashSizeCode, patch: Partial<TierFormRow>) => void;
}

export const FlashPricingTable = ({
  tierRows,
  onChange,
}: PerSizePricingTableProps) => {
  return (
    <div className={styles.tierTable}>
      <div className={styles.tierTableHeader}>
        <span className={styles.tierHeaderCell} />
        <span className={styles.tierHeaderCell}>Size</span>
        <span className={styles.tierHeaderCell}>Duration</span>
        <span className={styles.tierHeaderCell}>Price</span>
      </div>

      {FLASH_SIZE_OPTIONS.map((option) => {
        const row = tierRows[option.code];
        return (
          <div key={option.code} className={styles.tierRow}>
            <Checkbox
              aria-label={`Offer ${option.label}`}
              checked={row.enabled}
              onCheckedChange={(checked) =>
                onChange(option.code, { enabled: checked })
              }
            />
            <div className={styles.tierLabel}>
              <span className={styles.tierName}>{option.label}</span>
              <span className={styles.tierSubtle}>{option.description}</span>
            </div>
            <DurationSelect
              ariaLabel={`Duration for ${option.label}`}
              value={row.durationMinutes}
              onChange={(next) =>
                onChange(option.code, { durationMinutes: next })
              }
              disabled={!row.enabled}
            />
            <PriceInput
              ariaLabel={`Price for ${option.label}`}
              value={row.priceDollars}
              onChange={(next) => onChange(option.code, { priceDollars: next })}
              disabled={!row.enabled}
            />
          </div>
        );
      })}
    </div>
  );
};
