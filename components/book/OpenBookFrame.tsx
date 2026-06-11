// Next.js
import type { ReactNode } from "react";

// CSS
import styles from "@/styles/book/OpenBook.module.css";

// HTML Components
import InkspaceLogo from "@/public/logos/inkspace-logo.svg";

export const OpenBookFrame = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles.page}>
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
