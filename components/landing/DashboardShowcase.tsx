"use client";

// React
import { useEffect, useState } from "react";

// Next.js
import Image from "next/image";

// CSS
import clsx from "clsx";
import styles from "@/styles/landing/Landing.module.css";

// Libs
import { SHOWCASE_TABS, SHOWCASE_ROTATE_MS } from "@/constants/landing";

export const DashboardShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => {
      setActiveIndex((index) => (index + 1) % SHOWCASE_TABS.length);
    }, SHOWCASE_ROTATE_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, paused]);

  return (
    <section
      className={styles.showcase}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.tabBar} role="tablist" aria-label="Product views">
        {SHOWCASE_TABS.map((tab, index) => {
          const Icon = tab.icon;
          const active = index === activeIndex;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active}
              className={clsx(styles.tab, { [styles.tabActive]: active })}
              onClick={() => setActiveIndex(index)}
            >
              <Icon size={16} className={styles.tabIcon} />
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.showcaseInner}>
        <div className={styles.showcaseBackdrop}>
          <Image
            src="/landing-background.png"
            alt=""
            aria-hidden
            fill
            priority
            className={styles.showcaseBackdropImage}
          />
        </div>

        <div className={styles.window}>
          <div className={styles.viewport}>
            {SHOWCASE_TABS.map((tab, index) => (
              <div
                key={tab.key}
                className={clsx(styles.frame, {
                  [styles.frameActive]: index === activeIndex,
                })}
                aria-hidden={index !== activeIndex}
              >
                <Image
                  src={tab.image}
                  alt={tab.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 1100px) 100vw, 1040px"
                  className={styles.frameImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
