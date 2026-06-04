"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import { Button } from "@/components/ui/button";

// Libs
import { SETTINGS_TABS } from "@/constants/settings";
import type { SettingsTabId } from "@/types/settings";

interface SettingsNavProps {
  activeId: SettingsTabId;
  onSelect: (id: SettingsTabId) => void;
}

export const SettingsNav = ({ activeId, onSelect }: SettingsNavProps) => {
  return (
    <>
      <nav className={styles.navColumn} aria-label="Settings sections">
        <h2 className={styles.navTitle}>Settings</h2>
        <div className={styles.navList}>
          {SETTINGS_TABS.map((tab) => {
            const active = tab.id === activeId;
            return (
              <Button
                key={tab.id}
                variant="ghost"
                type="button"
                className={clsx(styles.navItem, {
                  [styles.active]: active,
                })}
                onClick={() => onSelect(tab.id)}
                aria-current={active ? "page" : undefined}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>
      </nav>

      <div className={styles.mobileNav} aria-label="Settings sections">
        {SETTINGS_TABS.map((tab) => {
          const active = tab.id === activeId;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              type="button"
              className={clsx(styles.mobileNavItem, {
                [styles.active]: active,
              })}
              onClick={() => onSelect(tab.id)}
              aria-current={active ? "page" : undefined}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>
    </>
  );
};
