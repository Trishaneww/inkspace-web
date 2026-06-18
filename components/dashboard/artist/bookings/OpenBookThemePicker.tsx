"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// Libs
import { OPEN_BOOK_THEMES } from "@/constants/openBookThemes";

// Types
import type { OpenBookTheme } from "@/types/bookings";

interface OpenBookThemePickerProps {
  value: OpenBookTheme;
  onChange: (theme: OpenBookTheme) => void;
}

export const OpenBookThemePicker = ({
  value,
  onChange,
}: OpenBookThemePickerProps) => {
  return (
    <div className={styles.themeGrid}>
      {OPEN_BOOK_THEMES.map((theme) => (
        <button
          key={theme.slug}
          type="button"
          className={clsx(styles.themeOption, {
            [styles.themeOptionActive]: value === theme.slug,
          })}
          onClick={() => onChange(theme.slug)}
          aria-pressed={value === theme.slug}
        >
          <span
            className={styles.themeSwatch}
            style={{ backgroundColor: theme.pageBg }}
          >
            <span
              className={styles.themeCard}
              style={{ backgroundColor: theme.surface }}
            >
              <span
                className={styles.themeAccent}
                style={{ backgroundColor: theme.accent }}
              />
            </span>
          </span>
          <span className={styles.themeLabel}>{theme.label}</span>
        </button>
      ))}
    </div>
  );
};
