"use client";

// React
import { useEffect, useState } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Check, Copy, Pencil } from "lucide-react";

// Libs
import { displayToast } from "@/lib/toast";

interface OpenBookPanelProps {
  slug: string;
  acceptingBookings: boolean;
  onEdit: () => void;
}

export const OpenBookPanel = ({
  slug,
  acceptingBookings,
  onEdit,
}: OpenBookPanelProps) => {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      setOrigin(window.location.origin),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  const path = `/@${slug}`;
  const fullUrl = `${origin}${path}`;
  const display = origin
    ? `${origin.replace(/^https?:\/\//, "")}${path}`
    : path;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      displayToast("Booking link copied to clipboard", "success");
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className={styles.linkPill}>
      <span
        className={clsx(
          styles.linkStatus,
          acceptingBookings ? styles.linkStatusOpen : styles.linkStatusClosed,
        )}
      >
        {acceptingBookings ? "Books open" : "Books closed"}
      </span>

      <span className={styles.linkUrlField}>{display}</span>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className={styles.linkCopyBtn}
        onClick={copy}
        aria-label="Copy booking link"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </Button>

      <span className={styles.linkDivider} />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={styles.linkEditBtn}
        onClick={onEdit}
      >
        <Pencil size={15} />
        Edit
      </Button>
    </div>
  );
};
