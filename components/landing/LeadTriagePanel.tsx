// CSS
import styles from "@/styles/landing/LeadTriagePanel.module.css";

// HTML Components
import { Check } from "lucide-react";

const SIGNALS = [
  "fits your style",
  "clear placement and size",
  "strong reference",
  "flexible on timing",
];

export const LeadTriagePanel = () => {
  return (
    <div className={styles.triage}>
      <article className={styles.card}>
        <header className={styles.head}>
          <span className={styles.avatar}>MS</span>
          <div className={styles.identity}>
            <span className={styles.name}>Mark Sohan</span>
            <span className={styles.subline}>Back · Colour realism</span>
          </div>
          <div className={styles.meta}>
            <span className={styles.badge}>Perfect Fit</span>
            <span className={styles.time}>Today</span>
          </div>
        </header>

        <p className={styles.summary}>
          Greek statue piece on the back with a strong reference, clear
          placement and size. Right in your wheelhouse.
        </p>

        <div className={styles.signals}>
          {SIGNALS.map((signal) => (
            <span key={signal} className={styles.signal}>
              <Check className={styles.signalIcon} aria-hidden />
              {signal}
            </span>
          ))}
        </div>

        <div className={styles.draft}>
          <span className={styles.draftLabel}>AI draft reply</span>
          <p className={styles.draftText}>
            Hey Mark, love the reference and the Greek statue direction is right
            up my alley. Are you free for a consultation this Friday? I can send
            over my availability so you can grab a time that works.
          </p>
        </div>

        <div className={styles.actions}>
          <span className={styles.primary}>Send &amp; book</span>
          <span className={styles.secondary}>Edit</span>
          <span className={styles.review}>Review</span>
        </div>
      </article>
    </div>
  );
};
