"use client";

// Next.js
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/FlashCard.module.css";

// HTML Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil } from "lucide-react";

// Libs
import {
  formatSizeCodesList,
  getFlashStatusLabel,
  getStartingPrice,
} from "@/lib/flashes";
import type { Flash } from "@/types/flash";
import { formatPrice } from "@/lib/formatters";

interface FlashCardProps {
  flash: Flash;
  onEdit: (flash: Flash) => void;
}

export const FlashCard = ({ flash, onEdit }: FlashCardProps) => {
  const router = useRouter();
  const priceCents = getStartingPrice(flash);
  const sizeList = formatSizeCodesList(flash.pricing_tiers);
  const isClaimed = flash.status === "claimed";

  const handleCardClick = () => {
    router.push(`/dashboard/artist/flashbook/${flash.id}`);
  };

  const handleEditClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onEdit(flash);
  };

  return (
    <Card
      className={styles.card}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className={styles.imageWrapper}>
        {flash.image_url ? (
          <Image
            src={flash.image_url}
            alt={flash.title}
            fill
            unoptimized
            className={styles.image}
          />
        ) : (
          <div className={styles.imageEmpty}>
            <ImageIcon size={32} />
          </div>
        )}

        <span
          className={clsx(styles.statusBadge, {
            [styles.available]: flash.status === "available",
            [styles.claimed]: flash.status === "claimed",
            [styles.draft]: flash.status === "draft",
            [styles.archived]: flash.status === "archived",
          })}
        >
          {getFlashStatusLabel(flash.status)}
        </span>

        <Button
          variant="ghost"
          type="button"
          className={styles.editBtn}
          aria-label="Edit flash"
          onClick={handleEditClick}
        >
          <Pencil />
        </Button>
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{flash.title}</h3>
          {priceCents !== null && (
            <span
              className={clsx(
                styles.price,
                isClaimed && styles.priceStrikethrough,
              )}
            >
              {formatPrice(priceCents, flash.currency)}
            </span>
          )}
        </div>
        <span className={styles.meta}>
          {flash.repeatable ? "Repeatable" : "Non-repeatable"}
          {sizeList && ` · ${sizeList}`}
        </span>
      </div>
    </Card>
  );
};
