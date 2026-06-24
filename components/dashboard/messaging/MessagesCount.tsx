"use client";

// CSS
import styles from "@/styles/dashboard/artist/ArtistPage.module.css";

// Hooks
import { useMessaging } from "./MessagingContext";

export const MessagesCount = () => {
  const { unreadCount } = useMessaging();
  if (unreadCount === 0) return null;

  return <span className={styles.count}>{unreadCount}</span>;
};
