// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/DashboardStats.module.css";

export const DashboardStatsGrid = () => {
  return (
    <div className={styles.boxGrid}>
      <div className={styles.box} />
      <div className={clsx(styles.box, styles.boxSpan2)} />
      <div className={styles.box} />
      <div className={styles.box} />
      <div className={styles.box} />
    </div>
  );
};
