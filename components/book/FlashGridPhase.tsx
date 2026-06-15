"use client";

// Next.js
import Image from "next/image";

// CSS
import clsx from "clsx";
import styles from "@/styles/book/BookingFlow.module.css";

// HTML Components
import { Loader2 } from "lucide-react";

// Libs
import type { Flash } from "@/types/flash";

interface FlashGridPhaseProps {
  flashes: Flash[];
  loading: boolean;
  error: string | null;
  selectedId: string;
  onSelect: (flashId: string) => void;
}

export const FlashGridPhase = ({
  flashes,
  loading,
  error,
  selectedId,
  onSelect,
}: FlashGridPhaseProps) => {
  if (loading) {
    return (
      <div className={styles.flashState}>
        <Loader2 size={22} className="animate-spin" />
      </div>
    );
  }
  if (error) {
    return <div className={styles.flashState}>{error}</div>;
  }
  if (flashes.length === 0) {
    return (
      <div className={styles.flashState}>
        No flash designs are available right now.
      </div>
    );
  }

  return (
    <div className={styles.flashGrid}>
      {flashes.map((flash) => (
        <button
          key={flash.id}
          type="button"
          className={clsx(
            styles.flashTile,
            selectedId === flash.id && styles.flashTileActive,
          )}
          onClick={() => onSelect(flash.id)}
          aria-label={flash.title}
        >
          {flash.image_url ? (
            <Image
              src={flash.image_url}
              alt={flash.title}
              fill
              unoptimized
              className={styles.flashTileImage}
            />
          ) : (
            <span className={styles.flashTilePlaceholder}>{flash.title}</span>
          )}
        </button>
      ))}
    </div>
  );
};
