"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/CreateAppointment.module.css";

// HTML Components
import { Button } from "@/components/ui/button";

interface SegmentedOption {
  value: string;
  label: string;
  hint?: string;
}

interface SegmentedChoiceProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  columns?: number;
}

export const SegmentedChoice = ({
  options,
  value,
  onChange,
  columns,
}: SegmentedChoiceProps) => (
  <div
    className={styles.choiceGrid}
    style={
      columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined
    }
  >
    {options.map((option) => (
      <Button
        key={option.value}
        variant="bare"
        size="bare"
        type="button"
        className={clsx(styles.choiceCard, {
          [styles.choiceCardActive]: value === option.value,
        })}
        onClick={() => onChange(option.value)}
      >
        <span className={styles.choiceLabel}>{option.label}</span>
        {option.hint && (
          <span className={styles.choiceHint}>{option.hint}</span>
        )}
      </Button>
    ))}
  </div>
);
