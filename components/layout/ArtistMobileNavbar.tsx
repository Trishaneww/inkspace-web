"use client";

// CSS
import styles from "@/styles/DashboardMobileNavbar.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Bell, Menu } from "lucide-react";
import InkspaceLogo from "@/public/logos/inkspace-logo.svg";

// Components
import { MobileSearch } from "@/components/layout/MobileSearch";

export const ArtistMobileNavbar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Button
          variant="ghost"
          size="icon-lg"
          onClick={toggleSidebar}
          aria-label="Open menu"
        >
          <Menu className={styles.navIcon} />
        </Button>
        <div className={styles.brand}>
          <InkspaceLogo className={styles.brandLogo} aria-hidden />
          <span className={styles.brandName}>Inkspace</span>
        </div>
      </div>

      <div className={styles.navbarRight}>
        <Button variant="ghost" size="icon-lg" aria-label="Notifications">
          <Bell className={styles.navIcon} />
        </Button>
        <MobileSearch />
      </div>
    </header>
  );
};
