"use client";

// CSS
import styles from "@/styles/DashboardTopbar.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Bell, CircleHelp } from "lucide-react";

export const ClientTopbar = () => {
  return (
    <header className={styles.topbar}>
      <div />
      <div className={styles.actions}>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className={styles.actionIcon} />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Help">
          <CircleHelp className={styles.actionIcon} />
        </Button>
      </div>
    </header>
  );
};
