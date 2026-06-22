// CSS
import styles from "@/styles/landing/PaymentsPanel.module.css";

// HTML Components
import { X, CreditCard, Check, ShieldCheck } from "lucide-react";

export const PaymentsPanel = () => {
  return (
    <div className={styles.payments}>
      <div className={styles.requestCard}>
        <div className={styles.reqHead}>
          <span className={styles.reqName}>Imani Bauer</span>
          <span className={styles.reqBadge}>Scheduled</span>
          <X className={styles.reqClose} aria-hidden />
        </div>
        <p className={styles.reqSub}>Request payment</p>

        <div className={styles.option}>
          <span className={styles.optionIcon}>
            <CreditCard className={styles.optionIconMark} aria-hidden />
          </span>
          <span className={styles.optionText}>
            <span className={styles.optionTitle}>Full payment</span>
            <span className={styles.optionDesc}>Charge the remaining balance</span>
          </span>
          <span className={styles.optionRadio} aria-hidden />
        </div>

        <div className={styles.breakdown}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Job total</span>
            <span className={styles.rowVal}>CA$800</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>
              Platform fee (6%)
              <span className={styles.rowNote}>Added to the client&apos;s total</span>
            </span>
            <span className={styles.rowVal}>+CA$48</span>
          </div>
          <div className={styles.rowDivider} />
          <div className={styles.row}>
            <span className={styles.rowStrong}>Client pays</span>
            <span className={styles.rowStrongVal}>CA$848</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowMuted}>You receive</span>
            <span className={styles.rowMuted}>CA$800</span>
          </div>
        </div>

        <p className={styles.billedLabel}>Billed to</p>
        <div className={styles.billed}>
          <div className={styles.billRow}>
            <span className={styles.billLabel}>Name</span>
            <span className={styles.billVal}>Imani Bauer</span>
          </div>
          <div className={styles.billRow}>
            <span className={styles.billLabel}>Email</span>
            <span className={styles.billVal}>imani.bauer1009@example.com</span>
          </div>
          <div className={styles.billRow}>
            <span className={styles.billLabel}>Phone</span>
            <span className={styles.billVal}>+1 416 500 1009</span>
          </div>
        </div>

        <p className={styles.reqFooter}>
          <ShieldCheck className={styles.reqFooterIcon} aria-hidden />
          We&apos;ll email Imani a secure link to pay CA$848.
        </p>
      </div>

      <div className={styles.stripeCard}>
        <span className={styles.stripeWord}>stripe</span>
        <span className={styles.stripeCheck}>
          <Check className={styles.stripeCheckMark} aria-hidden />
        </span>
        <p className={styles.stripeTitle}>Payment confirmed</p>
        <p className={styles.stripeSub}>CA$848.00 paid successfully</p>

        <div className={styles.stripeRows}>
          <div className={styles.sRow}>
            <span className={styles.sLabel}>Paid by</span>
            <span className={styles.sVal}>Imani Bauer</span>
          </div>
          <div className={styles.sRow}>
            <span className={styles.sLabel}>Amount</span>
            <span className={styles.sVal}>CA$848.00</span>
          </div>
          <div className={styles.sRow}>
            <span className={styles.sLabel}>Date</span>
            <span className={styles.sVal}>June 17, 2026</span>
          </div>
          <div className={styles.sRow}>
            <span className={styles.sLabel}>Payment method</span>
            <span className={styles.sCard}>
              <span className={styles.mcMark} aria-hidden />
              4242
            </span>
          </div>
        </div>

        <p className={styles.stripeFooter}>Powered by Stripe</p>
      </div>
    </div>
  );
};
