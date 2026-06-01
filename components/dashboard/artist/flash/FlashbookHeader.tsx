"use client";

// CSS
import styles from "@/styles/dashboard/artist/Flashbook.module.css";

export const FlashbookHeader = () => {
  return (
    <div className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.headerTitle}>Flashbook</h1>
        <span className={styles.headerSubtitle}>
          Manage and track your flash designs
        </span>
      </div>
    </div>
  );
};
