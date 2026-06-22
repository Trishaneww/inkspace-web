// CSS
import styles from "@/styles/dashboard/artist/ArtistPage.module.css";

// HTML Components
import { Star } from "lucide-react";

// Components
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";

export default function ArtistReviewsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reviews</h1>
        <span className={styles.subtitle}>
          See what your clients are saying about their work
        </span>
      </div>

      <DashboardEmptyState
        icon={Star}
        title="Reviews are coming soon"
        description="Soon you'll be able to collect client reviews, ratings, and healed-tattoo photos to build your reputation."
      />
    </div>
  );
}
