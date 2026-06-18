// Next.js
import type { ReactNode } from "react";

// CSS
import styles from "@/styles/book/OpenBook.module.css";

// HTML Components
import InkspaceLogo from "@/public/logos/inkspace-logo.svg";

// Types
import type { OpenBookTheme } from "@/types/bookings";

export const OpenBookFrame = ({
  children,
  theme = "inkspace",
}: {
  children: ReactNode;
  theme?: OpenBookTheme;
}) => {
  return (
    <div className={styles.page} data-ob-theme={theme}>
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
