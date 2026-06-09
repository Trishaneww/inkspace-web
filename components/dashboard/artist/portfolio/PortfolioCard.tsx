"use client";

// Next.js
import Image from "next/image";
import type { MouseEvent } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/PortfolioCard.module.css";

// HTML Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageIcon, Images, Pencil } from "lucide-react";

// Libs
import { getPortfolioStatusLabel } from "@/lib/portfolio";
import { COLOR_TYPE_LABELS } from "@/constants/portfolio";
import type { PortfolioItem } from "@/types/portfolio";

interface PortfolioCardProps {
  item: PortfolioItem;
  onEdit: (item: PortfolioItem) => void;
}

export const PortfolioCard = ({ item, onEdit }: PortfolioCardProps) => {
  const thumbnail = item.imageUrls[0];
  const meta = [
    item.colorType ? COLOR_TYPE_LABELS[item.colorType] : null,
    item.placement,
  ]
    .filter(Boolean)
    .join(" · ");

  const handleEditClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onEdit(item);
  };

  return (
    <Card
      className={styles.card}
      onClick={() => onEdit(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onEdit(item);
        }
      }}
    >
      <div className={styles.imageWrapper}>
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={item.title}
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
            [styles.published]: item.status === "published",
            [styles.draft]: item.status === "draft",
            [styles.archived]: item.status === "archived",
          })}
        >
          {getPortfolioStatusLabel(item.status)}
        </span>

        {item.imageKeys.length > 1 && (
          <span className={styles.photoCount}>
            <Images size={13} />
            {item.imageKeys.length}
          </span>
        )}

        <Button
          variant="ghost"
          type="button"
          className={styles.editBtn}
          aria-label="Edit piece"
          onClick={handleEditClick}
        >
          <Pencil />
        </Button>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{item.title}</h3>
        {meta && <span className={styles.meta}>{meta}</span>}
      </div>
    </Card>
  );
};
