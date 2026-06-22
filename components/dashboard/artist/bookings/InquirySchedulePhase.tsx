"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CalendarClock, type LucideIcon } from "lucide-react";

// Components
import { OptionsSelect } from "@/components/common/OptionsSelect";
import {
  ConsultationTimeChips,
  SessionTimeRange,
  TimeOfDayFilter,
} from "@/components/dashboard/artist/scheduling/SchedulePickers";

// Libs
import { clientPicksTime } from "@/lib/inquiryScheduling";
import {
  CONSULTATION_FORMAT_OPTIONS,
  SESSION_DURATION_OPTIONS,
} from "@/constants/bookings";
import { MIN_CHARGE_DOLLARS } from "@/constants/payments";
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
  currency: string;
  isReschedule?: boolean;
}

export const InquirySchedulePhase = ({
  inquiry,
  type,
  form,
  update,
  currency,
  isReschedule = false,
}: InquirySchedulePhaseProps) => {
  const firstName = inquiry.clientName.split(" ")[0];
  const clientPicks = clientPicksTime(type, form, isReschedule);

  return (
    <div className={styles.editFields}>
      {type === "session" && !isReschedule && (
        <SchedulingModeBoxes
          value={form.clientScheduled}
          onChange={(clientScheduled) => update({ clientScheduled })}
        />
      )}

      {type === "consultation" && (
        <ConsultationTypeBoxes
          value={form.consultationFormat}
          onChange={(consultationFormat) => update({ consultationFormat })}
        />
      )}

      {clientPicks && (
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
      )}

      {!clientPicks && (
        <ConcreteTimePicker
          inquiry={inquiry}
          type={type}
          form={form}
          update={update}
        />
      )}

      {type === "session" && !isReschedule && (
        <DepositField
          currency={currency}
          value={form.depositAmount}
          clientScheduled={form.clientScheduled}
          onChange={(depositAmount) => update({ depositAmount })}
        />
      )}
    </div>
  );
};

interface DepositFieldProps {
  currency: string;
  value: string;
  clientScheduled: boolean;
  onChange: (depositAmount: string) => void;
}

const DepositField = ({
  currency,
  value,
  clientScheduled,
  onChange,
}: DepositFieldProps) => {
  const hasDeposit = value.trim() !== "";
  return (
    <div className={styles.editField}>
      <div className={styles.fieldHeader}>
        <Label htmlFor="deposit-amount">Deposit ({currency})</Label>
        {hasDeposit && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
          >
            No deposit
          </Button>
        )}
      </div>
      <Input
        id="deposit-amount"
        type="number"
        min={MIN_CHARGE_DOLLARS}
        step="1"
        inputMode="decimal"
        placeholder="0.00"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className={styles.editHint}>
        {hasDeposit
          ? clientScheduled
            ? "After picking a time, the client pays this deposit to claim the slot. We hold it for 48 hours."
            : "The client pays this deposit to confirm the session. We hold the time for 48 hours until they do."
          : "No deposit — the session is booked right away."}
      </p>
    </div>
  );
};

interface ConcreteTimePickerProps {
  inquiry: Inquiry;
  type: AppointmentType;
  form: InquirySchedulingForm;
  update: (patch: Partial<InquirySchedulingForm>) => void;
}

const ConcreteTimePicker = ({
  inquiry,
  type,
  form,
  update,
}: ConcreteTimePickerProps) => {
  return (
    <>
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
    </>
  );
};

const SCHEDULING_MODE_BOXES: {
  clientScheduled: boolean;
  label: string;
  hint: string;
  icon: LucideIcon;
}[] = [
  {
    clientScheduled: false,
    label: "I'll set the time",
    hint: "Pick a slot now",
    icon: CalendarClock,
  },
  {
    clientScheduled: true,
    label: "Let the client pick",
    hint: "Email them to choose",
    icon: CalendarCheck,
  },
];

const SchedulingModeBoxes = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (clientScheduled: boolean) => void;
}) => (
  <div className={styles.scheduleSection}>
    <span className={styles.toggleLabel}>Who picks the time?</span>
    <div className={styles.schedulingRow}>
      {SCHEDULING_MODE_BOXES.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.label}
            type="button"
            className={clsx(styles.schedulingOption, {
              [styles.schedulingOptionActive]: value === option.clientScheduled,
            })}
            onClick={() => onChange(option.clientScheduled)}
          >
            <span className={styles.schedulingIcon}>
              <Icon size={18} />
            </span>
            <span className={styles.schedulingText}>
              <span className={styles.schedulingLabel}>{option.label}</span>
              <span className={styles.schedulingHint}>{option.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

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
