"use client";

// CSS
import styles from "@/styles/dashboard/artist/ArtistPage.module.css";

// Hooks
import { useNewRequests } from "./NewRequestsContext";

export const NewRequestsCount = () => {
  const { count } = useNewRequests();
  if (count === 0) return null;

  return <span className={styles.count}>{count}</span>;
};
