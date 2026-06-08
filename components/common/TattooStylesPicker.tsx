"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/TattooStylesPicker.module.css";

// Libs
import { TATTOO_STYLE_OPTIONS } from "@/constants/tattooStyles";
import { Button } from "../ui/button";

interface TattooStylesPickerProps {
  value: string[];
  onChange: (next: string[]) => void;
}

export const TattooStylesPicker = ({
  value,
  onChange,
}: TattooStylesPickerProps) => {
  const toggle = (slug: string) =>
    onChange(
      value.includes(slug) ? value.filter((s) => s !== slug) : [...value, slug],
    );

  return (
    <div className={styles.grid}>
      {TATTOO_STYLE_OPTIONS.map((option) => (
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
