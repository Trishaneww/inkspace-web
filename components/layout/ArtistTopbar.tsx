"use client";

// Next.js
import Link from "next/link";

// CSS
import styles from "@/styles/DashboardTopbar.module.css";

// Components
import { GlobalSearch } from "@/components/layout/GlobalSearch";

// HTML Components
import { Button } from "@/components/ui/button";
import { Bell, CircleHelp, Settings } from "lucide-react";

export const ArtistTopbar = () => {
  return (
    <header className={styles.topbar}>
      <GlobalSearch />

      <div className={styles.actions}>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className={styles.actionIcon} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          nativeButton={false}
          render={<Link href="/dashboard/artist/settings" />}
        >
          <Settings className={styles.actionIcon} />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Help">
          <CircleHelp className={styles.actionIcon} />
        </Button>
      </div>
    </header>
  );
};
