// Next.js
import type { ComponentType } from "react";
import Image from "next/image";

// CSS
import clsx from "clsx";
import styles from "@/styles/landing/Landing.module.css";

// Components
import { AutomationPanel } from "./AutomationPanel";
import { OpenBookPanel } from "./OpenBookPanel";
import { CalendarPanel } from "./CalendarPanel";
import { PaymentsPanel } from "./PaymentsPanel";
import { FlashbookPanel } from "./FlashbookPanel";

// Libs
import { FEATURE_ROWS, RIBBED_PANELS } from "@/constants/landing";

const FEATURE_PANELS: Record<string, ComponentType> = {
  openbook: OpenBookPanel,
  calendar: CalendarPanel,
  reminders: AutomationPanel,
  payments: PaymentsPanel,
  flashbook: FlashbookPanel,
};

export const FeatureSection = () => {
  return (
    <section id="features" className={styles.features}>
      <div className={styles.featuresIntro}>
        <p className={styles.featuresEyebrow}>Features</p>
        <h2 className={styles.featuresTitle}>Less admin. More art.</h2>
        <p className={styles.featuresSubtitle}>
          Inkspace runs the operational side of your studio in the background,
          so your time goes where it actually matters.
        </p>
      </div>

      {FEATURE_ROWS.map((feature, index) => {
        const Panel = FEATURE_PANELS[feature.key];

        return (
          <article
            key={feature.key}
            id={feature.key}
            className={clsx(styles.featureRow, {
              [styles.featureRowReversed]: index % 2 === 1,
            })}
          >
            <div className={styles.featureVisual}>
              <Image
                src={RIBBED_PANELS[index % RIBBED_PANELS.length]}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 768px) 100vw, 38rem"
                className={styles.featurePanel}
              />
              <div className={styles.featureShot}>
                {Panel ? (
                  <Panel />
                ) : (
                  <Image
                    src={feature.image}
                    alt={feature.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 90vw, 34rem"
                    className={styles.featureShotImage}
                  />
                )}
              </div>
            </div>

            <div className={styles.featureText}>
              <p className={styles.featureEyebrow}>{feature.eyebrow}</p>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
};
