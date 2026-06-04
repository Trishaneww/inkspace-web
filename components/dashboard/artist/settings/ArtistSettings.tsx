"use client";

// Next.js
import { useState } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// Components
import { SettingsNav } from "./SettingsNav";
import { PersonalInfoTab } from "./PersonalInfoTab";
import { EmailPasswordTab } from "./EmailPasswordTab";
import { PaymentsPayoutsTab } from "./PaymentsPayoutsTab";
import { DepositsTab } from "./DepositsTab";
import { BookingPreferencesTab } from "./BookingPreferencesTab";
import { PoliciesTab } from "./PoliciesTab";
import { NotificationsTab } from "./NotificationsTab";

// Hooks
import {
  ArtistSettingsController,
  useArtistSettings,
} from "@/hooks/useArtistSettings";

// Libs
import { SETTINGS_TABS } from "@/constants/settings";
import type { SettingsTabId } from "@/types/settings";

export const ArtistSettings = () => {
  const controller = useArtistSettings();
  const [activeTab, setActiveTab] = useState<SettingsTabId>("personal");

  const activeLabel =
    SETTINGS_TABS.find((tab) => tab.id === activeTab)?.label ?? "Settings";

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <SettingsNav activeId={activeTab} onSelect={setActiveTab} />

        <div className={styles.content}>
          <div className={styles.contentHeader}>
            <h1 className={styles.contentTitle}>{activeLabel}</h1>
          </div>

          <div className={styles.tabPanel}>
            {controller.loadError ? (
              <div className={styles.errorBanner}>{controller.loadError}</div>
            ) : controller.isLoading || !controller.data ? (
              <LoadingState />
            ) : (
              <TabContent activeTab={activeTab} controller={controller} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TabContent = ({
  activeTab,
  controller,
}: {
  activeTab: SettingsTabId;
  controller: ArtistSettingsController;
}) => {
  switch (activeTab) {
    case "personal":
      return <PersonalInfoTab controller={controller} />;
    case "email":
      return <EmailPasswordTab controller={controller} />;
    case "payments":
      return <PaymentsPayoutsTab controller={controller} />;
    case "deposits":
      return <DepositsTab controller={controller} />;
    case "booking":
      return <BookingPreferencesTab controller={controller} />;
    case "policies":
      return <PoliciesTab controller={controller} />;
    case "notifications":
      return <NotificationsTab controller={controller} />;
    default:
      return null;
  }
};

const LoadingState = () => {
  return (
    <div className={styles.skeletonStack}>
      <div className={clsx(styles.skeleton, styles.skeletonTitle)} />
      <div className={clsx(styles.skeleton, styles.skeletonRow)} />
      <div className={clsx(styles.skeleton, styles.skeletonRow)} />
      <div className={clsx(styles.skeleton, styles.skeletonRowShort)} />
    </div>
  );
};
