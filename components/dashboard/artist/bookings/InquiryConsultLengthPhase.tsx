"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { ChevronRight, Clock } from "lucide-react";

// Libs
import { CONSULTATION_LENGTH_OPTIONS } from "@/constants/bookings";
import { formatDurationMinutes } from "@/lib/formatters";

interface InquiryConsultLengthPhaseProps {
  selected: number;
  onSelect: (minutes: number) => void;
}

export const InquiryConsultLengthPhase = ({
  selected,
  onSelect,
}: InquiryConsultLengthPhaseProps) => (
  <div className={styles.editFields}>
    {CONSULTATION_LENGTH_OPTIONS.map((option) => (
      <button
        key={option.minutes}
        type="button"
        className={clsx(styles.lengthCard, {
          [styles.lengthCardActive]: selected === option.minutes,
        })}
        onClick={() => onSelect(option.minutes)}
      >
        <div className={styles.lengthCardBody}>
          <span className={styles.lengthCardTitle}>
            {option.title}
            {option.recommended && (
              <span className={styles.lengthCardBadge}>Recommended</span>
            )}
          </span>
          <span className={styles.lengthCardDesc}>{option.description}</span>
          <span className={styles.lengthCardMeta}>
            <Clock size={14} />
            {formatDurationMinutes(option.minutes)}
          </span>
        </div>
        <ChevronRight size={20} className={styles.lengthCardChevron} />
      </button>
    ))}
  </div>
);
