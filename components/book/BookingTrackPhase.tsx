"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Images, PenLine, type LucideIcon } from "lucide-react";

// Libs
import type { BookingFlowTrack } from "@/types/bookingFlow";

const TRACK_OPTIONS: {
  value: "custom" | "flash";
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: "custom",
    label: "Custom tattoo",
    description: "Describe your own idea and the artist will design it.",
    icon: PenLine,
  },
  {
    value: "flash",
    label: "Flash design",
    description: "Claim one of the artist's ready-to-go designs.",
    icon: Images,
  },
];

interface BookingTrackPhaseProps {
  track: BookingFlowTrack;
  onSelect: (track: BookingFlowTrack) => void;
}

export const BookingTrackPhase = ({
  track,
  onSelect,
}: BookingTrackPhaseProps) => (
  <div className={styles.field}>
    <div className={styles.choiceCards}>
      {TRACK_OPTIONS.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            className={clsx(
              styles.choiceCard,
              track === option.value && styles.choiceCardActive,
            )}
            onClick={() => onSelect(option.value)}
          >
            <span className={styles.choiceIcon}>
              <Icon size={18} />
            </span>
            <span className={styles.choiceLabel}>{option.label}</span>
            <span className={styles.choiceDescription}>
              {option.description}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
