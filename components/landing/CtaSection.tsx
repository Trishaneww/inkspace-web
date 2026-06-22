// Next.js
import Link from "next/link";
import Image from "next/image";

// CSS
import styles from "@/styles/landing/Landing.module.css";

// Components
import { BrowserDevice } from "./BrowserDevice";

export const CtaSection = () => {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaCard}>
        <div className={styles.ctaBackdrop}>
          <Image
            src="/landing-background.png"
            alt=""
            aria-hidden
            fill
            className={styles.ctaBackdropImage}
          />
        </div>
        <div className={styles.ctaScrim} aria-hidden />

        <div className={styles.ctaContent}>
        <p className={styles.ctaEyebrow}>Run your whole studio</p>
        <h2 className={styles.ctaTitle}>Everything you need, in one place</h2>
        <p className={styles.ctaSubtitle}>
          From the first inquiry to the final payment, Inkspace keeps your
          bookings, calendar, clients, and money together — so you can spend
          less time managing and more time tattooing.
        </p>
        <Link href="/signup" className={styles.ctaGetStarted}>
          Get started
        </Link>
      </div>

        <div className={styles.ctaDevice}>
          <BrowserDevice />
        </div>
      </div>
    </section>
  );
};
