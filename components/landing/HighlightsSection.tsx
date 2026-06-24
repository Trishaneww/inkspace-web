// Next.js
import type { ComponentType } from "react";
import Image from "next/image";

// CSS
import styles from "@/styles/landing/Landing.module.css";

// Components
import { LeadTriagePanel } from "./LeadTriagePanel";
import { MessagingPanel } from "./MessagingPanel";
import { FollowUpPanel } from "./FollowUpPanel";

// Libs
import { HIGHLIGHT_FEATURES, RIBBED_PANELS } from "@/constants/landing";

const HIGHLIGHT_PANELS: Record<string, ComponentType> = {
  triage: LeadTriagePanel,
  messaging: MessagingPanel,
  followup: FollowUpPanel,
};

export const HighlightsSection = () => {
  return (
    <section className={styles.highlights}>
      <div className={styles.highlightsIntro}>
        <p className={styles.featuresEyebrow}>New in Inkspace</p>
        <h2 className={styles.featuresTitle}>
          The front desk you never had
        </h2>
        <p className={styles.featuresSubtitle}>
          Inkspace does more than hold your bookings. It reads every new lead,
          replies in your voice, and chases the ones who go quiet.
        </p>
      </div>

      <div className={styles.highlightGrid}>
        {HIGHLIGHT_FEATURES.map((feature, index) => {
          const Panel = HIGHLIGHT_PANELS[feature.key];

          return (
            <article key={feature.key} className={styles.highlight}>
              <div className={styles.highlightVisual}>
                <Image
                  src={RIBBED_PANELS[index % RIBBED_PANELS.length]}
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 768px) 100vw, 24rem"
                  className={styles.featurePanel}
                />
                <div className={styles.highlightShot}>
                  {Panel && <Panel />}
                </div>
              </div>

              <div className={styles.highlightText}>
                <p className={styles.highlightEyebrow}>{feature.eyebrow}</p>
                <h3 className={styles.highlightTitle}>{feature.title}</h3>
                <p className={styles.highlightDescription}>
                  {feature.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
