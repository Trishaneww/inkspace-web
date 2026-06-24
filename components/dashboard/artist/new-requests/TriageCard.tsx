"use client";

// Next.js
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/new-requests/NewRequests.module.css";

// HTML Components
import { AlertTriangle, Check, Loader2, X } from "lucide-react";

// Components
import { InitialsAvatar } from "@/components/common/InitialsAvatar";

// Libs
import { useAuth } from "@/lib/auth";
import { messagingApi } from "@/lib/api/messaging";
import { bookingsApi } from "@/lib/api/bookings";
import { displayToast } from "@/lib/toast";
import {
  formatFullName,
  formatPrice,
  formatRelativeDate,
  formatTime,
  formatWeekday,
} from "@/lib/formatters";
import { TATTOO_STYLE_LABELS } from "@/constants/tattooStyles";
import { COLOR_TYPE_LABELS } from "@/constants/bookings";

// Types
import type {
  Inquiry,
  OpenBookAvailabilityWindow,
  TriageLabel,
} from "@/types/bookings";

const LABEL_META: Record<
  TriageLabel,
  { text: string; send: string; className: string }
> = {
  book: {
    text: "Perfect Fit",
    send: "Send & book",
    className: styles.badgeBook,
  },
  needs_info: {
    text: "Needs Review",
    send: "Send question",
    className: styles.badgeNeedsInfo,
  },
  pass: {
    text: "Likely Pass",
    send: "Send decline",
    className: styles.badgePass,
  },
  spam: {
    text: "Likely Spam",
    send: "Decline",
    className: styles.badgeSpam,
  },
};

const CARD_EXIT_MS = 220;

interface TriageCardProps {
  inquiry: Inquiry;
  onActed: (id: string) => void;
}

export const TriageCard = ({ inquiry, onActed }: TriageCardProps) => {
  const { token } = useAuth();
  const router = useRouter();
  const { ai } = inquiry;

  const [draft, setDraft] = useState(ai.draftReply);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const name = formatFullName(inquiry.clientName || "Client");
  const reviewHref = `/dashboard/artist/bookings?inquiry=${inquiry.id}&view=actions`;
  const ready = ai.status === "ready" && ai.label !== null;
  const label = ai.label as TriageLabel;
  const meta = ready ? LABEL_META[label] : null;

  const styleLabel = inquiry.styles
    .map((s) => TATTOO_STYLE_LABELS[s] ?? s)
    .join(", ");
  const subline = [inquiry.placement, styleLabel].filter(Boolean).join(" · ");

  const goodSignals = expanded ? ai.signals.good : ai.signals.good.slice(0, 2);
  const badSignals = expanded ? ai.signals.bad : ai.signals.bad.slice(0, 2);
  const signals = [
    ...goodSignals.map((text) => ({ text, good: true })),
    ...badSignals.map((text) => ({ text, good: false })),
  ];

  const toggleExpanded = () => setExpanded((open) => !open);

  const sendDraft = async (): Promise<boolean> => {
    const body = draft.trim();
    if (!token || !inquiry.conversationId || !body) return false;
    await messagingApi.sendArtistMessage(token, inquiry.conversationId, body);
    return true;
  };

  const clearWithToast = (message: string) => {
    displayToast(message, "success");
    setExiting(true);
    window.setTimeout(() => onActed(inquiry.id), CARD_EXIT_MS);
  };

  const runPrimary = async () => {
    if (!token || busy) return;
    setBusy(true);
    try {
      if (label === "spam") {
        await bookingsApi.decline(token, inquiry.id);
        clearWithToast("Declined");
      } else if (label === "pass") {
        await sendDraft();
        await bookingsApi.decline(token, inquiry.id);
        clearWithToast("Declined");
      } else if (label === "needs_info") {
        if (!(await sendDraft())) {
          router.push(reviewHref);
          return;
        }
        clearWithToast("Question sent");
      } else {
        await sendDraft();
        router.push(reviewHref);
      }
    } catch {
      setBusy(false);
      displayToast("Couldn't complete that", "error", "Please try again.");
    }
  };

  return (
    <article className={clsx(styles.card, exiting && styles.cardExiting)}>
      <header className={styles.cardHeader}>
        <InitialsAvatar name={name} seed={inquiry.clientEmail} />
        <div className={styles.cardIdentity}>
          <div className={styles.cardName}>{name}</div>
          {subline && <div className={styles.cardSubline}>{subline}</div>}
        </div>
        <div className={styles.cardMeta}>
          {meta && (
            <span className={clsx(styles.badge, meta.className)}>
              {meta.text}
            </span>
          )}
          <span className={styles.cardTime}>
            {ready && ai.valueCents != null
              ? `~${formatPrice(ai.valueCents)}`
              : formatRelativeDate(inquiry.createdAt)}
          </span>
        </div>
      </header>

      {ready ? (
        <>
          {ai.redFlags.length > 0 && (
            <div className={styles.redFlags}>
              <AlertTriangle size={14} className={styles.redFlagIcon} />
              <span>{ai.redFlags.join(" · ")}</span>
            </div>
          )}

          {ai.summary && (
            <p className={clsx(styles.summary, expanded && styles.summaryFull)}>
              {ai.summary}
            </p>
          )}

          {signals.length > 0 && (
            <div
              className={clsx(styles.signals, expanded && styles.signalsFull)}
            >
              {signals.map((s) => (
                <span key={s.text} className={styles.signal}>
                  {s.good ? (
                    <Check size={13} className={styles.signalGood} />
                  ) : (
                    <X size={13} className={styles.signalBad} />
                  )}
                  <span className={styles.signalText}>{s.text}</span>
                </span>
              ))}
            </div>
          )}

          {expanded && <InquiryDetails inquiry={inquiry} />}

          {inquiry.conversationId && label !== "spam" && (
            <div className={styles.draft}>
              <span className={styles.draftLabel}>AI draft reply</span>
              {editing ? (
                <textarea
                  className={styles.draftInput}
                  value={draft}
                  rows={4}
                  autoFocus
                  onChange={(e) => setDraft(e.target.value)}
                />
              ) : (
                <p
                  className={clsx(
                    styles.draftPreview,
                    expanded && styles.draftFull,
                  )}
                >
                  {draft}
                </p>
              )}
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryAction}
              onClick={() => void runPrimary()}
              disabled={busy}
            >
              {busy && <Loader2 size={14} className="animate-spin" />}
              {meta?.send}
            </button>
            {inquiry.conversationId && label !== "spam" && (
              <button
                type="button"
                className={styles.secondaryAction}
                onClick={() => setEditing((v) => !v)}
              >
                {editing ? "Done" : "Edit"}
              </button>
            )}
            <button
              type="button"
              className={styles.reviewLink}
              onClick={toggleExpanded}
              aria-expanded={expanded}
            >
              {expanded ? "Hide details" : "Review"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.reviewingRow}>
            <span className={styles.reviewing}>
              <Loader2 size={14} className="animate-spin" />
              Reviewing…
            </span>
            <button
              type="button"
              className={styles.reviewLink}
              onClick={toggleExpanded}
              aria-expanded={expanded}
            >
              {expanded ? "Hide details" : "Review"}
            </button>
          </div>
          {expanded && <InquiryDetails inquiry={inquiry} />}
        </>
      )}
    </article>
  );
};

const InquiryDetails = ({ inquiry }: { inquiry: Inquiry }) => {
  const colourLabel = COLOR_TYPE_LABELS[inquiry.colorType] ?? inquiry.colorType;
  const styleLabel = inquiry.styles
    .map((s) => TATTOO_STYLE_LABELS[s] ?? s)
    .join(", ");
  const windows = Array.isArray(inquiry.clientAvailability)
    ? (inquiry.clientAvailability as OpenBookAvailabilityWindow[])
    : [];

  return (
    <div className={styles.details}>
      <span className={styles.detailsLabel}>Inquiry details</span>

      {inquiry.description && (
        <p className={styles.detailText}>{inquiry.description}</p>
      )}

      <dl className={styles.detailRows}>
        {inquiry.placement && (
          <DetailRow label="Placement" value={inquiry.placement} />
        )}
        {inquiry.approxSizeInches != null && (
          <DetailRow
            label="Approx. size"
            value={`${inquiry.approxSizeInches}"`}
          />
        )}
        {colourLabel && <DetailRow label="Colour" value={colourLabel} />}
        {styleLabel && <DetailRow label="Styles" value={styleLabel} />}
      </dl>

      {windows.length > 0 && (
        <div className={styles.detailGroup}>
          <span className={styles.detailSubLabel}>Preferred times</span>
          <dl className={styles.detailRows}>
            {windows.map((window) => (
              <DetailRow
                key={`${window.weekday}-${window.startMinute}`}
                label={formatWeekday(window.weekday)}
                value={`${formatTime(window.startMinute, true)} – ${formatTime(
                  window.endMinute,
                  true,
                )}`}
              />
            ))}
          </dl>
        </div>
      )}

      {inquiry.referenceImageUrls.length > 0 && (
        <div className={styles.detailGroup}>
          <span className={styles.detailSubLabel}>Reference photos</span>
          <div className={styles.referenceGrid}>
            {inquiry.referenceImageUrls.map((url, index) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.referenceThumb}
              >
                <Image
                  src={url}
                  alt={`Reference photo ${index + 1}`}
                  fill
                  unoptimized
                  className={styles.referenceImg}
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className={styles.detailRow}>
    <span className={styles.detailRowLabel}>{label}</span>
    <span className={styles.detailRowValue}>{value}</span>
  </div>
);
