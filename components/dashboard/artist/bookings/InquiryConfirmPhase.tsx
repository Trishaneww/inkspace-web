"use client";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { AlertTriangle, Info } from "lucide-react";

// Components
import {
  ReviewWarning,
  ReviewCard,
  ReviewTypeBox,
} from "@/components/dashboard/artist/bookings/ReviewPrimitives";

// Types
import type { InquiryActionItem } from "@/types/bookings";

export const InquiryConfirmPhase = ({ item }: { item: InquiryActionItem }) => {
  const variant = item.destructive ? "destructive" : "default";

  return (
    <div className={styles.editFields}>
      <ReviewCard>
        <ReviewTypeBox
          icon={item.icon}
          label={item.label}
          hint={item.description || undefined}
          variant={variant}
        />

        {item.confirmMessage && (
          <ReviewWarning icon={item.destructive ? AlertTriangle : Info}>
            {item.confirmMessage}
          </ReviewWarning>
        )}
      </ReviewCard>
    </div>
  );
};
