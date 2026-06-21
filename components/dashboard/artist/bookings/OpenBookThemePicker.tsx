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

      <button
        type="button"
        className={clsx(styles.themeOption, {
          [styles.themeOptionActive]: value === "custom",
        })}
        onClick={() => onChange("custom")}
        aria-pressed={value === "custom"}
      >
        <span
          className={styles.themeSwatch}
          style={{
            background:
              "linear-gradient(135deg, hsl(280, 90%, 88%), hsl(230, 90%, 85%), hsl(25, 95%, 80%))",
          }}
        >
          <span
            className={styles.themeCard}
            style={{ backgroundColor: "hsl(0, 0%, 100%)" }}
          >
            <span
              className={styles.themeAccent}
              style={{
                background:
                  "linear-gradient(135deg, hsl(258, 90%, 66%), hsl(330, 85%, 60%))",
              }}
            />
          </span>
        </span>
        <span className={styles.themeLabel}>Custom</span>
      </button>
    </div>
  );
};
