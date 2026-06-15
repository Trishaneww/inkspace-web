"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { Calendar } from "@/components/ui/calendar";

// Components
import { OptionsSelect } from "@/components/common/OptionsSelect";
import {
  ConsultationTimeChips,
  SessionTimeRange,
  TimeOfDayFilter,
} from "@/components/dashboard/artist/scheduling/SchedulePickers";

// Libs
import { isArtistScheduled } from "@/lib/inquiryScheduling";
import {
  CONSULTATION_FORMAT_OPTIONS,
  SESSION_DURATION_OPTIONS,
} from "@/constants/bookings";
import { formatDurationMinutes } from "@/lib/formatters";
import type {
  AppointmentType,
  ConsultationFormat,
  Inquiry,
  InquirySchedulingForm,
} from "@/types/bookings";

interface InquirySchedulePhaseProps {
  inquiry: Inquiry;
  type: AppointmentType;
  form: InquirySchedulingForm;
  update: (patch: Partial<InquirySchedulingForm>) => void;
  isReschedule?: boolean;
}

export const InquirySchedulePhase = ({
  inquiry,
  type,
  form,
  update,
  isReschedule = false,
}: InquirySchedulePhaseProps) => {
  const firstName = inquiry.clientName.split(" ")[0];
  const pickConcreteTime = isArtistScheduled(inquiry) || isReschedule;

  // Client-scheduled: the artist never picks a slot — the client self-books later.
  if (!pickConcreteTime) {
    return (
      <div className={styles.editFields}>
        {type === "session" ? (
          <div className={styles.editField}>
            <label className={styles.toggleLabel}>Session length</label>
            <OptionsSelect
              ariaLabel="Session length"
              value={String(form.durationMinutes)}
              options={SESSION_DURATION_OPTIONS}
              onValueChange={(value) =>
                update({ durationMinutes: Number(value) })
              }
            />
            <p className={styles.editHint}>
              {firstName} will get an email to pick a start time for this{" "}
              {formatDurationMinutes(form.durationMinutes)} session.
            </p>
          </div>
        ) : (
          <>
            <ConsultationTypeBoxes
              value={form.consultationFormat}
              onChange={(consultationFormat) => update({ consultationFormat })}
            />
            <p className={styles.scheduleNote}>
              {firstName} will get an email to pick a time for this{" "}
              {formatDurationMinutes(form.consultationDurationMinutes)}{" "}
              consultation.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.editFields}>
      {type === "consultation" && (
        <ConsultationTypeBoxes
          value={form.consultationFormat}
          onChange={(consultationFormat) => update({ consultationFormat })}
        />
      )}

      <div className={styles.scheduleSection}>
        <span className={styles.toggleLabel}>Preferred date</span>
        <div className={styles.calendarWrap}>
          <Calendar
            mode="single"
            selected={form.date ?? undefined}
            onSelect={(date) =>
              update({ date: date ?? null, startMinute: null, endMinute: null })
            }
            disabled={{ before: new Date() }}
          />
        </div>
      </div>

      {form.date && (
        <>
          <TimeOfDayFilter
            value={form.timeFilter}
            onChange={(timeFilter) =>
              update({ timeFilter, startMinute: null, endMinute: null })
            }
          />
          {type === "consultation" ? (
            <ConsultationTimeChips
              availability={inquiry.artistAvailability}
              date={form.date}
              timeFilter={form.timeFilter}
              durationMinutes={form.consultationDurationMinutes}
              selected={form.startMinute}
              onSelect={(minute) => update({ startMinute: minute })}
            />
          ) : (
            <SessionTimeRange
              availability={inquiry.artistAvailability}
              date={form.date}
              timeFilter={form.timeFilter}
              startMinute={form.startMinute}
              endMinute={form.endMinute}
              onChange={(patch) => update(patch)}
            />
          )}
        </>
      )}
    </div>
  );
};

const ConsultationTypeBoxes = ({
  value,
  onChange,
}: {
  value: ConsultationFormat;
  onChange: (format: ConsultationFormat) => void;
}) => (
  <div className={styles.scheduleSection}>
    <span className={styles.toggleLabel}>Format</span>
    <div className={styles.typeBoxRow}>
      {CONSULTATION_FORMAT_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={clsx(styles.timeFilterBtn, {
            [styles.timeFilterBtnActive]: value === option.value,
          })}
          onClick={() => onChange(option.value)}
        >
          <span className={styles.timeFilterLabel}>{option.label}</span>
          <span className={styles.timeFilterHint}>{option.hint}</span>
        </button>
      ))}
    </div>
  </div>
);
