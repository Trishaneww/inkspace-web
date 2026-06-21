// Next.js
import type { CSSProperties, ReactNode } from "react";

// CSS
import styles from "@/styles/book/OpenBook.module.css";

// HTML Components
import InkspaceLogo from "@/public/logos/inkspace-logo.svg";

// Libs
import {
  buildBackgroundImageStyle,
  buildCustomThemeStyle,
} from "@/lib/openBookThemeStyle";

// Types
import type { CustomTheme, OpenBookTheme } from "@/types/bookings";

export const OpenBookFrame = ({
  children,
  theme = "inkspace",
  customTheme,
  backgroundImageUrl,
}: {
  children: ReactNode;
  theme?: OpenBookTheme;
  customTheme?: CustomTheme;
  backgroundImageUrl?: string;
}) => {
  const pageStyle = buildPageStyle(theme, customTheme, backgroundImageUrl);

  return (
    <div className={styles.page} data-ob-theme={theme} style={pageStyle}>
      <main className={styles.stage}>{children}</main>
      <footer className={styles.brand}>
        <InkspaceLogo className={styles.brandLogo} aria-hidden />
        <span className={styles.brandTagline}>
          Seamlessly manage your requests, books, and deposits.
        </span>
      </footer>
    </div>
  );
};

const buildPageStyle = (
  theme: OpenBookTheme,
  customTheme?: CustomTheme,
  backgroundImageUrl?: string,
): CSSProperties | undefined => {
  if (theme !== "custom" || !customTheme) return undefined;

  return {
    ...buildCustomThemeStyle(customTheme),
    ...(backgroundImageUrl
      ? buildBackgroundImageStyle(backgroundImageUrl)
      : {}),
  };
};
