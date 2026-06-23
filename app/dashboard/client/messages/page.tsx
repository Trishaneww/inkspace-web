// Next.js
import { Suspense } from "react";

// CSS
import styles from "@/styles/dashboard/client/ClientPage.module.css";

// Components
import { DashboardMessages } from "@/components/dashboard/messaging/DashboardMessages";

export default function ClientMessagesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
        <span className={styles.subtitle}>Chat with your artists</span>
      </div>

      <Suspense>
        <DashboardMessages scope="client" />
      </Suspense>
    </div>
  );
}
