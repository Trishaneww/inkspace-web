// Next.js
import Link from "next/link";

// CSS
import styles from "@/styles/landing/Landing.module.css";

// Logos
import InkspaceLogo from "@/public/logos/inkspace-logo.svg";

// Libs
import { BOOK_DEMO_URL } from "@/constants/landing";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
];

export const LandingHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.headerLeft}>
          <Link href="/" className={styles.brand}>
            <InkspaceLogo className={styles.brandLogo} aria-hidden />
            <span className={styles.brandName}>Inkspace</span>
          </Link>

          <nav className={styles.nav}>
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={styles.navLink}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className={styles.headerActions}>
          <Link href="/login" className={styles.loginButton}>
            Log in
          </Link>
          <a
            href={BOOK_DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            Book a demo
          </a>
        </div>
      </div>
    </header>
  );
};
