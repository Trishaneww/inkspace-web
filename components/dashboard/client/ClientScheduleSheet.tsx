"use client";

// Next.js
import { useEffect, useState } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/client/ClientScheduleSheet.module.css";

// HTML Components
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Libs
import { clientInquiriesApi } from "@/lib/api/clientInquiries";
import { getApiErrorMessage } from "@/hooks/useAuthForm";
import { useAuth } from "@/lib/auth";
import { displayToast } from "@/lib/toast";
import { formatDurationMinutes, formatDateParam } from "@/lib/formatters";

// Types
import type { ClientInquiry, SlotOption } from "@/types/bookings";

interface ClientScheduleSheetProps {
  inquiry: ClientInquiry | null;
  onClose: () => void;
  onScheduled: () => void;
}

export const ClientScheduleSheet = ({
  inquiry,
  onClose,
  onScheduled,
}: ClientScheduleSheetProps) => {
  return (
    <Sheet
      open={!!inquiry}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className={styles.sheet} showCloseButton>
        {inquiry && (
          <ScheduleForm
            key={inquiry.id}
            inquiry={inquiry}
            onClose={onClose}
            onScheduled={onScheduled}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

interface ScheduleFormProps {
  inquiry: ClientInquiry;
  onClose: () => void;
  onScheduled: () => void;
}

const ScheduleForm = ({ inquiry, onClose, onScheduled }: ScheduleFormProps) => {
  const { token } = useAuth();

  const [date, setDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<SlotOption[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !date) return;
    let active = true;
    const load = async () => {
      setLoadingSlots(true);
      setSelected(null);
      setError(null);
      try {
        const res = await clientInquiriesApi.listSlots(
          token,
          inquiry.id,
          formatDateParam(date),
        );
        if (active) setSlots(res.slots);
      } catch {
        if (active) setError("Couldn't load times. Try another day.");
      } finally {
        if (active) setLoadingSlots(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [token, date, inquiry.id]);

  const confirm = async () => {
    if (!token || !selected) return;
    setSubmitting(true);
    setError(null);
    try {
      await clientInquiriesApi.schedule(token, inquiry.id, selected);
      displayToast("Your time is booked", "success");
      onScheduled();
      onClose();
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Couldn't book that time — it may have just been taken.",
        ),
      );
      setSubmitting(false);
    }
  };

  const duration = inquiry.appointment?.durationMinutes ?? 0;
  const artist = inquiry.artistName || "your artist";

  return (
    <div className={styles.form}>
      <SheetTitle className={styles.title}>Pick a time</SheetTitle>
      <p className={styles.lead}>
        Choose a start time for your {formatDurationMinutes(duration)} session
        with {artist}.
      </p>

      <div className={styles.fields}>
        <div className={styles.section}>
          <span className={styles.label}>Date</span>
          <div className={styles.calendarWrap}>
            <Calendar
              mode="single"
              selected={date ?? undefined}
              onSelect={(value) => setDate(value ?? null)}
              disabled={{ before: new Date() }}
            />
          </div>
        </div>

        {date && (
          <div className={styles.section}>
            <span className={styles.label}>Available times</span>
            {loadingSlots ? (
              <div className={styles.slotsLoading}>
                <Loader2 size={18} className="animate-spin" />
              </div>
            ) : slots.length === 0 ? (
              <p className={styles.empty}>
                No openings on this day. Try another date.
              </p>
            ) : (
              <div className={styles.slots}>
                {slots.map((slot) => (
                  <button
                    key={slot.start}
                    type="button"
                    className={clsx(
                      styles.slot,
                      selected === slot.start && styles.slotActive,
                    )}
                    onClick={() => setSelected(slot.start)}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}
      </div>

      <div className={styles.footer}>
        <Button
          variant="ghost"
          className={styles.cancelBtn}
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          className={styles.confirmBtn}
          onClick={confirm}
          disabled={!selected || submitting}
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Confirm time
        </Button>
      </div>
    </div>
  );
};
