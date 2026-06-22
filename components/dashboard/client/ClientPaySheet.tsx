"use client";

// Next.js
import { useState } from "react";

// CSS
import styles from "@/styles/dashboard/client/ClientPaySheet.module.css";

// HTML Components
import { SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Loader2, Lock, MapPin, User } from "lucide-react";

// Libs
import { paymentsApi } from "@/lib/api/payments";
import { useAuth } from "@/lib/auth";
import { getClientPaymentBreakdown } from "@/lib/clientInquiries";
import { findPayablePayment } from "@/lib/clientInquiries";
import {
  formatDate,
  formatLocation,
  formatPrice,
  formatTimeRange,
} from "@/lib/formatters";

// Types
import type { ClientInquiry } from "@/types/bookings";

export const PayForm = ({
  inquiry,
  onClose,
  onChangeTime,
}: {
  inquiry: ClientInquiry;
  onClose: () => void;
  onChangeTime?: (inquiry: ClientInquiry) => void;
}) => {
  const { token } = useAuth();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payable = findPayablePayment(inquiry);
  if (!payable) {
    return (
      <div className={styles.form}>
        <SheetTitle className={styles.title}>Nothing to pay</SheetTitle>
        <p className={styles.lead}>
          This booking has no payment due right now.
        </p>
        <div className={styles.footer}>
          <Button className={styles.payBtn} onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  const breakdown = getClientPaymentBreakdown(inquiry, payable);
  const { currency } = breakdown;
  const artist = inquiry.artistName || "your artist";

  const appointment = inquiry.appointment;
  const start = payable.scheduledStart ?? appointment?.scheduledStart;
  const canChangeTime =
    !!onChangeTime && appointment?.schedulingOrigin === "client_booked";
  const details = [
    { icon: User, value: artist },
    start ? { icon: CalendarDays, value: formatDate(start) } : null,
    start
      ? {
          icon: Clock,
          value: formatTimeRange(start, appointment?.durationMinutes ?? 0),
        }
      : null,
    inquiry.location
      ? { icon: MapPin, value: formatLocation(inquiry.location) }
      : null,
  ].filter((detail) => detail !== null);

  const pay = async () => {
    if (!token) return;
    setPaying(true);
    setError(null);
    try {
      const { url } = await paymentsApi.createClientCheckout(
        payable.publicToken,
        token,
      );
      window.location.assign(url);
    } catch {
      setError("Couldn't start checkout. Please try again.");
      setPaying(false);
    }
  };

  return (
    <div className={styles.form}>
      <SheetTitle className={styles.title}>
        Pay your {breakdown.title.toLowerCase()}
      </SheetTitle>
      <p className={styles.lead}>
        Securing your booking with {artist}. Here are the details.
      </p>

      <div className={styles.details}>
        {details.map((detail) => {
          const Icon = detail.icon;
          return (
            <div key={detail.value} className={styles.detailRow}>
              <Icon size={15} className={styles.detailIcon} />
              <span>{detail.value}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.breakdown}>
        {breakdown.depositPaidCents > 0 && (
          <>
            <div className={`${styles.line} ${styles.lineMuted}`}>
              <span>Deposit already paid</span>
              <span>{formatPrice(breakdown.depositPaidCents, currency)}</span>
            </div>
            <div className={styles.divider} />
          </>
        )}
        <div className={styles.total}>
          <span>You pay</span>
          <span>{formatPrice(breakdown.totalCents, currency)}</span>
        </div>
      </div>

      <span className={styles.secure}>
        <Lock size={13} />
        Secure payment via Stripe
      </span>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.footer}>
        {canChangeTime ? (
          <Button
            variant="ghost"
            onClick={() => onChangeTime?.(inquiry)}
            disabled={paying}
          >
            Change time
          </Button>
        ) : (
          <Button variant="ghost" onClick={onClose} disabled={paying}>
            Cancel
          </Button>
        )}
        <Button className={styles.payBtn} onClick={pay} disabled={paying}>
          {paying && <Loader2 size={16} className="animate-spin" />}
          Pay {formatPrice(breakdown.totalCents, currency)}
        </Button>
      </div>
    </div>
  );
};
