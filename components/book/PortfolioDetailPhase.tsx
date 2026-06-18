"use client";

// Next.js
import Image from "next/image";

// CSS
import clsx from "clsx";
import styles from "@/styles/book/PortfolioBrowse.module.css";

// Components
import { DetailLayout } from "./DetailLayout";

// Libs
import { TATTOO_STYLE_LABELS } from "@/constants/tattooStyles";
import { COLOR_TYPE_LABELS } from "@/constants/portfolio";
import { PORTFOLIO_BROWSE_PHASE_META } from "@/constants/portfolioBrowse";
import { formatDate, formatDurationMinutes } from "@/lib/formatters";
import { PortfolioBrowsePhase } from "@/types/portfolioBrowse";

// Types
import type { PortfolioItem } from "@/types/portfolio";

interface PortfolioDetailPhaseProps {
  item: PortfolioItem;
  activeImageIndex: number;
  onSelectImage: (index: number) => void;
}

export const PortfolioDetailPhase = ({
  item,
  activeImageIndex,
  onSelectImage,
}: PortfolioDetailPhaseProps) => {
  const heroImage = item.imageUrls[activeImageIndex] ?? item.imageUrls[0];

  const metaRows = [
    item.placement ? { label: "Placement", value: item.placement } : null,
    item.approxSizeInches
      ? { label: "Size", value: `${item.approxSizeInches}"` }
      : null,
    item.colorType
      ? { label: "Color", value: COLOR_TYPE_LABELS[item.colorType] }
      : null,
    item.sessionCount
      ? {
          label: "Sessions",
          value: `${item.sessionCount} ${
            item.sessionCount === 1 ? "session" : "sessions"
          }`,
        }
      : null,
    item.totalMinutes
      ? { label: "Time", value: formatDurationMinutes(item.totalMinutes) }
      : null,
    item.completionDate
      ? { label: "Completed", value: formatDate(item.completionDate) }
      : null,
    { label: "Healed result", value: item.healed ? "Yes" : "No" },
  ].filter((row) => row !== null);

  const { lead, rest } =
    PORTFOLIO_BROWSE_PHASE_META[PortfolioBrowsePhase.Detail];

  const media = (
    <>
      <div className={styles.hero}>
        {heroImage && (
          <Image
            src={heroImage}
            alt={item.title}
            fill
            unoptimized
            className={styles.heroImage}
          />
        )}
      </div>

      {item.imageUrls.length > 1 && (
        <div className={styles.thumbs}>
          {item.imageUrls.map((url, index) => (
            <button
              key={url}
              type="button"
              className={clsx(
                styles.thumb,
                index === activeImageIndex && styles.thumbActive,
              )}
              onClick={() => onSelectImage(index)}
              aria-label={`${item.title} photo ${index + 1}`}
            >
              <Image
                src={url}
                alt={`${item.title} photo ${index + 1}`}
                fill
                unoptimized
                className={styles.thumbImage}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );

  return (
    <DetailLayout lead={lead} rest={rest} media={media}>
      <h3 className={styles.name}>{item.title}</h3>

      {item.description && (
        <p className={styles.description}>{item.description}</p>
      )}

      {item.styles.length > 0 && (
        <div className={styles.chips}>
          {item.styles.map((style) => (
            <span key={style} className={styles.chip}>
              {TATTOO_STYLE_LABELS[style] ?? style}
            </span>
          ))}
        </div>
      )}

      <dl className={styles.meta}>
        {metaRows.map((row) => (
          <div key={row.label} className={styles.metaRow}>
            <dt className={styles.metaLabel}>{row.label}</dt>
            <dd className={styles.metaValue}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </DetailLayout>
  );
};
