"use client";

// Next.js
import { useState } from "react";
import Image from "next/image";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/FlashDetail.module.css";

// HTML Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ImageIcon,
  Layers,
  MapPin,
  Tag,
  Wallet,
} from "lucide-react";

// Libs
import {
  formatSizeCodesList,
  getFlashStatusLabel,
  getStartingPrice,
} from "@/lib/flashes";
import type { Flash } from "@/types/flash";
import { formatDate, formatPrice } from "@/lib/formatters";

interface FlashDetailContentProps {
  flash: Flash;
}

export const FlashDetailContent = ({ flash }: FlashDetailContentProps) => {
  return (
    <>
      <FlashHero flash={flash} />
      <MetadataCard flash={flash} />
      <BookingsCard />
      <InsightsCard flash={flash} />
    </>
  );
};

const FlashHero = ({ flash }: { flash: Flash }) => {
  const imageUrls = [flash.image_url, flash.reference_image_url].filter(
    (url): url is string => Boolean(url),
  );

  return (
    <Card className={styles.heroRow}>
      <div className={styles.imageBlock}>
        {imageUrls.length > 0 ? (
          <FlashImageSlider images={imageUrls} title={flash.title} />
        ) : (
          <div className={clsx(styles.image, styles.placeholderText)}>
            <ImageIcon />
          </div>
        )}
        <span className={styles.imageCaption}>
          Uploaded {formatDate(flash.created_at)}
        </span>
      </div>

      <div className={styles.heroDetails}>
        <div className={styles.heroHeader}>
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
          <h1 className={styles.title}>{flash.title}</h1>
          <span className={styles.subtitle}>
            {flash.repeatable ? "Repeatable" : "Non-repeatable"}
          </span>
        </div>

        <div className={styles.statGrid}>
          <StatCell label="Bookings" value="—" />
          <StatCell label="Revenue" value="—" />
          <StatCell label="Views" value={flash.view_count.toString()} />
          <StatCell label="Conv. rate" value="—" />
        </div>
      </div>
    </Card>
  );
};

const StatCell = ({ label, value }: { label: string; value: string }) => (
  <div className={styles.statCell}>
    <span className={styles.statLabel}>{label}</span>
    <span className={styles.statValue}>{value}</span>
  </div>
);

const FlashImageSlider = ({
  images,
  title,
}: {
  images: string[];
  title: string;
}) => {
  const [index, setIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const showNext = () => setIndex((current) => (current + 1) % images.length);

  return (
    <div className={styles.slider}>
      <div
        className={styles.sliderTrack}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, slideIndex) => (
          <div key={src} className={styles.slide}>
            <Image
              src={src}
              alt={slideIndex === 0 ? title : `${title} reference`}
              fill
              unoptimized
              sizes="(max-width: 900px) 100vw, 18rem"
              className={styles.slideImage}
            />
          </div>
        ))}
      </div>

      {hasMultiple && (
        <Button
          variant="ghost"
          type="button"
          className={styles.sliderArrow}
          onClick={showNext}
          aria-label="Show next image"
        >
          <ChevronRight size={18} />
        </Button>
      )}
    </div>
  );
};

const MetadataCard = ({ flash }: { flash: Flash }) => {
  const startingCents = getStartingPrice(flash);
  const sizesList = formatSizeCodesList(flash.pricing_tiers);

  return (
    <Card className={styles.metaCard}>
      <MetaRow
        icon={<Layers size={14} />}
        label="Sizes"
        value={sizesList || "—"}
      />
      <MetaRow
        icon={<Wallet size={14} />}
        label="Starting price"
        value={
          startingCents !== null
            ? formatPrice(startingCents, flash.currency)
            : "—"
        }
      />
      <MetaRow
        icon={<MapPin size={14} />}
        label="Allowed placements"
        value={
          flash.placements.length ? flash.placements.join(", ") : "All areas"
        }
      />
      <MetaRow
        icon={<Tag size={14} />}
        label="Style tags"
        value={
          flash.styles.length ? (
            <div className={styles.tagList}>
              {flash.styles.map((tag) => (
                <span key={tag} className={styles.tagChip}>
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            "—"
          )
        }
      />
    </Card>
  );
};

interface MetaRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const MetaRow = ({ icon, label, value }: MetaRowProps) => (
  <div className={styles.metaRow}>
    <span className={styles.metaIcon}>{icon}</span>
    <span className={styles.metaLabel}>{label}</span>
    <span>{value}</span>
  </div>
);

const BookingsCard = () => (
  <Card className={styles.sectionCard}>
    <CardHeader className={styles.sectionHeader}>
      <CardTitle className={styles.sectionTitle}>Bookings</CardTitle>
    </CardHeader>
    <CardContent className={styles.sectionContent}>
      <span className={styles.placeholderText}>
        Once a client books this flash, their reservation will appear here.
      </span>
    </CardContent>
  </Card>
);

const InsightsCard = ({ flash }: { flash: Flash }) => (
  <Card className={styles.sectionCard}>
    <CardHeader className={styles.sectionHeader}>
      <CardTitle className={styles.sectionTitle}>Insights</CardTitle>
    </CardHeader>
    <CardContent className={styles.sectionContent}>
      <div className={styles.insightsGrid}>
        <div>
          <div className={styles.insightLabel}>Most booked size</div>
          <div className={styles.insightValue}>—</div>
        </div>
        <div>
          <div className={styles.insightLabel}>Avg. time to book</div>
          <div className={styles.insightValue}>—</div>
        </div>
        <div>
          <div className={styles.insightLabel}>Top referral source</div>
          <div className={styles.insightValue}>—</div>
        </div>
        <div>
          <div className={styles.insightLabel}>Saved by clients</div>
          <div className={styles.insightValue}>
            {flash.save_count.toLocaleString()} times
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
