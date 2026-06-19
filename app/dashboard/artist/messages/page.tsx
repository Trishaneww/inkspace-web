// CSS
import styles from "@/styles/dashboard/artist/ArtistPage.module.css";

// HTML Components
import { MessagesSquare } from "lucide-react";

// Components
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";

export default function ArtistMessagesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
        <span className={styles.subtitle}>
          Chat with the clients you have booked
        </span>
      </div>

      <DashboardEmptyState
        icon={MessagesSquare}
        title="Messages are coming soon"
        description="Soon you'll be able to message your clients right here to talk through their design, placement, and appointment details."
      />
    </div>
  );
}
