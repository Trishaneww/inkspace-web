// Next.js
import Link from "next/link";

// CSS
import styles from "@/styles/landing/Landing.module.css";

// HTML Components
import { Star } from "lucide-react";

// Libs
import { BOOK_DEMO_URL } from "@/constants/landing";

export const LandingHero = () => {
  return (
    <section className={styles.hero}>
      <p className={styles.heroEyebrow}>The operating system for tattoo artists</p>

      <h1 className={styles.heroTitle}>
        Run your entire
        <br />
        tattoo business in one place
      </h1>

      <p className={styles.heroSubtitle}>
        Bookings, scheduling, payments, and your portfolio — Inkspace brings
        every part of your studio together, so you can spend less time managing
        and more time tattooing.
      </p>

      <div className={styles.heroActions}>
        <Link href="/signup" className={styles.heroPrimary}>
          Start for free
        </Link>
        <a
          href={BOOK_DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.heroSecondary}
        >
          Book a demo
        </a>
      </div>

      <div className={styles.heroRating}>
        <span className={styles.heroStars} aria-hidden>
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} size={15} className={styles.heroStar} />
          ))}
        </span>
        <span className={styles.heroRatingText}>
          Loved by tattoo artists everywhere
        </span>
      </div>
    </section>
  );
};
