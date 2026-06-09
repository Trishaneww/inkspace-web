"use client";

// CSS
import styles from "@/styles/dashboard/artist/PortfolioCard.module.css";

// HTML Components
import { Plus } from "lucide-react";

interface AddPortfolioCardProps {
  onClick: () => void;
}

export const AddPortfolioCard = ({ onClick }: AddPortfolioCardProps) => {
  return (
    <button type="button" className={styles.addCard} onClick={onClick}>
      <span className={styles.addIcon} aria-hidden>
        <Plus />
      </span>
      <span className={styles.addLabel}>Add piece</span>
    </button>
  );
};
