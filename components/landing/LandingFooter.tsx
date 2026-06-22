// Next.js
import Link from "next/link";

// CSS
import styles from "@/styles/landing/Landing.module.css";

// Logos
import InkspaceLogo from "@/public/logos/inkspace-logo.svg";

// Libs
import { BOOK_DEMO_URL, FOOTER_FEATURE_LINKS } from "@/constants/landing";

export const LandingFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.brand}>
            <InkspaceLogo className={styles.brandLogo} aria-hidden />
            <span className={styles.brandName}>Inkspace</span>
          </Link>
          <p className={styles.footerTagline}>
            Everything you need to run your tattoo studio, in one place.
          </p>
        </div>

        <div className={styles.footerCols}>
          <div className={styles.footerCol}>
            <h3 className={styles.footerColTitle}>Features</h3>
            {FOOTER_FEATURE_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={styles.footerLink}>
                {link.label}
              </a>
            ))}
          </div>

          <div className={styles.footerCol}>
            <h3 className={styles.footerColTitle}>Get started</h3>
            <a href="#faq" className={styles.footerLink}>
              FAQ
            </a>
            <a
              href={BOOK_DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              Book a demo
            </a>
            <Link href="/login" className={styles.footerLink}>
              Log in
            </Link>
            <Link href="/signup" className={styles.footerLink}>
              Create an account
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>© 2026 Inkspace</span>
      </div>
    </footer>
  );
};
