"use client";

// CSS
import styles from "@/styles/dashboard/artist/FlashCard.module.css";

// HTML Components
import { Plus } from "lucide-react";

interface AddFlashCardProps {
  onClick: () => void;
}

export const AddFlashCard = ({ onClick }: AddFlashCardProps) => {
  return (
    <button type="button" className={styles.addCard} onClick={onClick}>
      <span className={styles.addIcon} aria-hidden>
        <Plus />
      </span>
      <span className={styles.addLabel}>Add flash</span>
    </button>
  );
};
