"use client";

// CSS
import styles from "@/styles/dashboard/artist/Portfolio.module.css";

export const PortfolioHeader = () => {
  return (
    <div className={styles.header}>
      <div className={styles.headerText}>
        <h1 className={styles.headerTitle}>Portfolio</h1>
        <span className={styles.headerSubtitle}>
          Showcase your finished work for clients to browse before booking
        </span>
      </div>
    </div>
  );
};
