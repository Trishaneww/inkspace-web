"use client";

// CSS
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Check } from "lucide-react";

// Components
import { ShowcaseCard } from "@/components/landing/ShowcaseCard";

// Libs
import { COMPLETION_BULLETS } from "@/constants/onboarding";

export const CompletedPhase = () => (
  <div className={styles.completion}>
    <div className={styles.completionText}>
      <ol className={styles.bullets}>
        {COMPLETION_BULLETS.map((bullet, index) => (
          <li key={bullet.title} className={styles.bullet}>
            <div className={styles.bulletRail}>
              <span className={styles.bulletMark}>
                <Check size={12} />
              </span>
              {index < COMPLETION_BULLETS.length - 1 && (
                <span className={styles.bulletLine} />
              )}
            </div>
            <div className={styles.bulletBody}>
              <span className={styles.bulletTitle}>{bullet.title}</span>
              <span className={styles.bulletDescription}>
                {bullet.description}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>

    <div className={styles.completionImage}>
      <ShowcaseCard />
    </div>
  </div>
);
