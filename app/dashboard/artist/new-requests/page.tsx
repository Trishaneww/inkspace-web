// CSS
import styles from "@/styles/dashboard/artist/ArtistPage.module.css";

// Components
import { NewRequests } from "@/components/dashboard/artist/new-requests/NewRequests";
import { NewRequestsCount } from "@/components/dashboard/artist/new-requests/NewRequestsCount";

export default function NewRequestsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>New Requests</h1>
          <NewRequestsCount />
        </div>
        <span className={styles.subtitle}>
          Inquiries you haven&apos;t acted on yet — reviewed for you.
        </span>
      </div>

      <NewRequests />
    </div>
  );
}
