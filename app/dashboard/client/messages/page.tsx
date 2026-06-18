// CSS
import styles from "@/styles/dashboard/client/ClientPage.module.css";

// HTML Components
import { MessagesSquare } from "lucide-react";

// Components
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";

export default function ClientMessagesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
        <span className={styles.subtitle}>
          Chat with the artists you have booked with
        </span>
      </div>

      <DashboardEmptyState
        icon={MessagesSquare}
        title="Messages are coming soon"
        description="Soon you'll be able to message your artists right here to talk through your design, placement, and appointment details."
      />
    </div>
  );
}
