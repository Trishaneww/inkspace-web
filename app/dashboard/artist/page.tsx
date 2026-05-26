// CSS
import styles from "@/styles/dashboard/Dashboard.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { PlusIcon, DownloadIcon } from "lucide-react";

// Components
import { DashboardStatsGrid } from "@/components/dashboard/artist/DashboardStatsGrid";

export default function ArtistDashboardPage() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeaderContainer}>
        <h1 className={styles.dashboardTitle}>Artist Dashboard</h1>
        <div className={styles.dashboardHeaderButtons}>
          <Button variant="outline" className={styles.secondaryBtn}>
            <DownloadIcon className={styles.plusIcon} />
            Export
          </Button>
          <Button variant="outline" className={styles.primaryBtn}>
            <PlusIcon className={styles.plusIcon} />
            New Lead
          </Button>
        </div>
      </div>

      <DashboardStatsGrid />
    </div>
  );
}
