"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/TattooStylesPicker.module.css";

// HTML Components
import { Button } from "@/components/ui/button";

interface ChipOption {
  value: string;
  label: string;
}

interface ChipMultiSelectProps {
  value: string[];
  options: ChipOption[];
  onChange: (next: string[]) => void;
}

export const ChipMultiSelect = ({
  value,
  options,
  onChange,
}: ChipMultiSelectProps) => {
  const toggle = (option: string) =>
    onChange(
      value.includes(option)
        ? value.filter((item) => item !== option)
        : [...value, option],
    );

  return (
    <div className={styles.grid}>
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          className={clsx(styles.chip, {
            [styles.chipActive]: value.includes(option.value),
          })}
          onClick={() => toggle(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};
