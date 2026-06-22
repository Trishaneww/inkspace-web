// Next.js
import Image from "next/image";

// CSS
import clsx from "clsx";
import styles from "@/styles/landing/FlashbookPanel.module.css";

// HTML Components
import { Check } from "lucide-react";

export const FlashbookPanel = () => {
  return (
    <div className={styles.flashbook}>
      <div className={styles.flashCard}>
        <div className={styles.flashBar}>
          <span className={styles.flashDots} aria-hidden>
            <span className={styles.flashDot} />
            <span className={styles.flashDot} />
            <span className={styles.flashDot} />
          </span>
          <span className={styles.flashUrl}>inkspace.dev/@diegoviera</span>
        </div>

        <div className={styles.flashBody}>
          <div className={styles.flashLeft}>
            <div className={styles.flashImageWrap}>
              <Image
                src="/landing/flash-example.png"
                alt="Hades Charon flash design"
                fill
                unoptimized
                sizes="(max-width: 768px) 40vw, 12rem"
                className={styles.flashImage}
              />
            </div>
            <p className={styles.flashName}>Hades Charon</p>
            <p className={styles.flashDeposit}>CA$300 deposit to claim</p>
          </div>

          <div className={styles.flashRight}>
            <p className={styles.claimTitle}>Claim this flash</p>
            <p className={styles.claimSub}>
              Choose your size, placement, and location.
            </p>

            <div className={styles.optGroup}>
              <span className={styles.optLabel}>Size</span>
              <div className={styles.chips}>
                <span className={clsx(styles.chip, styles.chipActive)}>Large</span>
                <span className={styles.chip}>X-large</span>
              </div>
            </div>

            <div className={styles.optGroup}>
              <span className={styles.optLabel}>Placement</span>
              <div className={styles.chips}>
                <span className={clsx(styles.chip, styles.chipActive)}>Thigh</span>
                <span className={styles.chip}>Back</span>
                <span className={styles.chip}>Calf</span>
              </div>
            </div>

            <div className={styles.summary}>
              <div className={styles.sumRow}>
                <span className={styles.sumLabel}>Deposit</span>
                <span className={styles.sumVal}>CA$300</span>
              </div>
              <div className={styles.sumRow}>
                <span className={styles.sumLabel}>Est. session</span>
                <span className={styles.sumVal}>6–8 hrs</span>
              </div>
            </div>

            <span className={styles.bookBtn}>Book this flash</span>
          </div>
        </div>
      </div>

      <div className={styles.stripeCard}>
        <span className={styles.stripeWord}>stripe</span>
        <span className={styles.stripeCheck}>
          <Check className={styles.stripeCheckMark} aria-hidden />
        </span>
        <p className={styles.stripeTitle}>Payment successful</p>
        <p className={styles.stripeSub}>Flash secured · CA$300.00</p>

        <div className={styles.stripeRows}>
          <div className={styles.sRow}>
            <span className={styles.sLabel}>Flash</span>
            <span className={styles.sVal}>Hades Charon</span>
          </div>
          <div className={styles.sRow}>
            <span className={styles.sLabel}>Deposit</span>
            <span className={styles.sVal}>CA$300.00</span>
          </div>
        </div>

        <p className={styles.stripeFooter}>Powered by Stripe</p>
      </div>
    </div>
  );
};
