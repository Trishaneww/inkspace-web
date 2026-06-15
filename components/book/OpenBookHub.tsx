"use client";

// Next.js
import { useState, type ReactNode } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/book/OpenBook.module.css";

// HTML Components
import {
  Calendar,
  ChevronDown,
  HeartPulse,
  HelpCircle,
  MapPin,
} from "lucide-react";
import { Button } from "../ui/button";
import InstagramLogo from "@/public/logos/instagram-logo.svg";

// Components
import { BookingFlowDialog } from "@/components/book/BookingFlowDialog";

// Libs
import { formatMonthDayRange, formatTime } from "@/lib/formatters";
import { WEEKDAYS } from "@/constants/settings";
import type {
  OpenBookAvailabilityWindow,
  OpenBookProfile,
} from "@/types/bookings";
import type { BookingFlowEntry } from "@/types/bookingFlow";

export const OpenBookHub = ({ profile }: { profile: OpenBookProfile }) => {
  const [entry, setEntry] = useState<BookingFlowEntry | null>(null);

  return (
    <>
      <ProfileCard
        profile={profile}
        onBook={() => setEntry("book")}
        onBrowseFlash={() => setEntry("flash")}
      />
      {entry && (
        <BookingFlowDialog
          profile={profile}
          entry={entry}
          onOpenChange={(open) => {
            if (!open) setEntry(null);
          }}
        />
      )}
    </>
  );
};

const ProfileCard = ({
  profile,
  onBook,
  onBrowseFlash,
}: {
  profile: OpenBookProfile;
  onBook: () => void;
  onBrowseFlash: () => void;
}) => {
  const initial = profile.username.trim().charAt(0).toUpperCase() || "?";

  return (
    <article className={styles.card}>
      <header className={styles.identity}>
        <div className={styles.avatar}>
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={`@${profile.username}`}
              className={styles.avatarImage}
            />
          ) : (
            <span className={styles.avatarInitial}>{initial}</span>
          )}
        </div>

        <h1 className={styles.name}>@{profile.username}</h1>

        {profile.location && (
          <span className={styles.location}>
            <MapPin size={14} aria-hidden />
            {profile.location}
          </span>
        )}

        <span
          className={clsx(
            styles.status,
            profile.acceptingBookings ? styles.statusOpen : styles.statusClosed,
          )}
        >
          <span className={styles.statusDot} aria-hidden />
          {profile.acceptingBookings
            ? "Accepting bookings"
            : "Not accepting bookings"}
        </span>
      </header>

      <TravelBanner profile={profile} />

      <Button
        type="button"
        className={styles.bookButton}
        onClick={onBook}
        disabled={!profile.acceptingBookings}
      >
        Book a tattoo
      </Button>

      {profile.hasFlashes && (
        <Button
          type="button"
          variant="outline"
          className={styles.flashbookButton}
          onClick={onBrowseFlash}
          disabled={!profile.acceptingBookings}
        >
          Browse flashbook
        </Button>
      )}

      <div className={styles.sections}>
        {profile.availability.length > 0 && (
          <HubSection
            icon={<Calendar size={18} aria-hidden />}
            label="Availability"
          >
            <AvailabilityList windows={profile.availability} />
          </HubSection>
        )}

        {profile.aftercare && (
          <HubSection
            icon={<HeartPulse size={18} aria-hidden />}
            label="Aftercare"
          >
            <p className={styles.prose}>{profile.aftercare}</p>
          </HubSection>
        )}

        {profile.faqs.length > 0 && (
          <HubSection
            icon={<HelpCircle size={18} aria-hidden />}
            label="FAQ & policies"
          >
            <dl className={styles.faqList}>
              {profile.faqs.map((faq, i) => (
                <div key={i} className={styles.faqItem}>
                  <dt className={styles.faqQuestion}>{faq.question}</dt>
                  <dd className={styles.faqAnswer}>{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </HubSection>
        )}
      </div>

      {profile.instagramUrl && (
        <div className={styles.socials}>
          <a
            href={profile.instagramUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={styles.socialLink}
            aria-label="Instagram"
          >
            <InstagramLogo className={styles.socialIcon} aria-hidden />
          </a>
        </div>
      )}
    </article>
  );
};

const TravelBanner = ({ profile }: { profile: OpenBookProfile }) => {
  if (profile.locations.length <= 1) return null;
  const current =
    profile.locations.find((location) => location.isCurrent) ??
    profile.locations.find((location) => location.isPrimary);
  if (!current) return null;

  const place = [current.city, current.country].filter(Boolean).join(", ");
  return (
    <div className={styles.travelBanner}>
      <MapPin size={15} aria-hidden />
      <span>
        {current.isPrimary ? (
          <>Currently at the home studio{place ? ` — ${place}` : ""}</>
        ) : (
          <>
            Guest spot{place ? ` in ${place}` : ""}
            {current.startDate && current.endDate && (
              <span className={styles.travelDates}>
                {" · "}
                {formatMonthDayRange(current.startDate, current.endDate)}
              </span>
            )}
          </>
        )}
      </span>
    </div>
  );
};

const HubSection = ({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={clsx(styles.section, open && styles.sectionOpen)}>
      <Button
        type="button"
        variant="ghost"
        className={styles.sectionTrigger}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className={styles.sectionLabel}>
          <span className={styles.sectionIcon}>{icon}</span>
          {label}
        </span>
        <ChevronDown size={18} className={styles.sectionChevron} aria-hidden />
      </Button>
      {open && <div className={styles.sectionContent}>{children}</div>}
    </div>
  );
};

const AvailabilityList = ({
  windows,
}: {
  windows: OpenBookAvailabilityWindow[];
}) => {
  const days = WEEKDAYS.map((day) => ({
    label: day.label,
    ranges: windows
      .filter((window) => window.weekday === day.value)
      .sort((a, b) => a.startMinute - b.startMinute)
      .map(
        (window) =>
          `${formatTime(window.startMinute)} – ${formatTime(window.endMinute)}`,
      ),
  })).filter((day) => day.ranges.length > 0);

  return (
    <ul className={styles.availabilityList}>
      {days.map((day) => (
        <li key={day.label} className={styles.availabilityRow}>
          <span className={styles.availabilityDay}>{day.label}</span>
          <span className={styles.availabilityHours}>
            {day.ranges.join(", ")}
          </span>
        </li>
      ))}
    </ul>
  );
};
