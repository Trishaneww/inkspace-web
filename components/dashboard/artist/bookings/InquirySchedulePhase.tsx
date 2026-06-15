"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Components
import { OptionsSelect } from "@/components/common/OptionsSelect";

// Libs
import {
  groupTimeOptions,
  isArtistScheduled,
  TIME_FILTERS,
  type TimeGroup,
} from "@/lib/inquiryScheduling";
import {
  CONSULTATION_FORMAT_OPTIONS,
  SESSION_DURATION_OPTIONS,
} from "@/constants/bookings";
import { formatDurationMinutes, formatTimeOfDay } from "@/lib/formatters";
import type {
  AppointmentType,
  ConsultationFormat,
  Inquiry,
  InquirySchedulingForm,
  TimeFilter,
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
            <ConsultationTimePicker
              inquiry={inquiry}
              date={form.date}
              form={form}
              update={update}
            />
          ) : (
            <SessionTimeRange
              inquiry={inquiry}
              date={form.date}
              form={form}
              update={update}
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

const TimeOfDayFilter = ({
  value,
  onChange,
}: {
  value: TimeFilter;
  onChange: (filter: TimeFilter) => void;
}) => (
  <div className={styles.timeFilterRow}>
    {TIME_FILTERS.map((filter) => (
      <button
        key={filter.value}
        type="button"
        className={clsx(styles.timeFilterBtn, {
          [styles.timeFilterBtnActive]: value === filter.value,
        })}
        onClick={() => onChange(filter.value)}
      >
        <span className={styles.timeFilterLabel}>{filter.label}</span>
        <span className={styles.timeFilterHint}>{filter.hint}</span>
      </button>
    ))}
  </div>
);

const ConsultationTimePicker = ({
  inquiry,
  date,
  form,
  update,
}: {
  inquiry: Inquiry;
  date: Date;
  form: InquirySchedulingForm;
  update: (patch: Partial<InquirySchedulingForm>) => void;
}) => {
  const groups = groupTimeOptions(
    inquiry.artistAvailability,
    date,
    form.timeFilter,
  );

  return (
    <div className={styles.scheduleSection}>
      <span className={styles.toggleLabel}>
        Pick a time · {formatDurationMinutes(form.consultationDurationMinutes)}
      </span>
      {groups.length === 0 ? (
        <p className={styles.scheduleNote}>No times in this range.</p>
      ) : (
        groups.map((group) => (
          <TimeChipGroup
            key={group.label || "all"}
            group={group}
            selected={form.startMinute}
            onSelect={(minute) => update({ startMinute: minute })}
          />
        ))
      )}
    </div>
  );
};

const TimeChipGroup = ({
  group,
  selected,
  onSelect,
}: {
  group: TimeGroup;
  selected: number | null;
  onSelect: (minute: number) => void;
}) => (
  <div className={styles.timeGroup}>
    {group.label && (
      <span className={styles.timeGroupLabel}>{group.label}</span>
    )}
    <div className={styles.timeChipGrid}>
      {group.options.map((option) => {
        const minute = Number(option.value);
        return (
          <button
            key={option.value}
            type="button"
            className={clsx(styles.timeChip, {
              [styles.timeChipActive]: selected === minute,
            })}
            onClick={() => onSelect(minute)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);

const SessionTimeRange = ({
  inquiry,
  date,
  form,
  update,
}: {
  inquiry: Inquiry;
  date: Date;
  form: InquirySchedulingForm;
  update: (patch: Partial<InquirySchedulingForm>) => void;
}) => {
  const fromGroups = groupTimeOptions(
    inquiry.artistAvailability,
    date,
    form.timeFilter,
  );
  const toGroups = groupTimeOptions(
    inquiry.artistAvailability,
    date,
    form.timeFilter,
    form.startMinute ?? -1,
  );
  const length =
    form.startMinute !== null &&
    form.endMinute !== null &&
    form.endMinute > form.startMinute
      ? form.endMinute - form.startMinute
      : null;

  return (
    <div className={styles.scheduleSection}>
      <span className={styles.toggleLabel}>Time</span>
      <div className={styles.timeRangeRow}>
        <GroupedTimeSelect
          ariaLabel="Start time"
          placeholder="From"
          value={form.startMinute === null ? "" : String(form.startMinute)}
          groups={fromGroups}
          onValueChange={(value) => {
            const startMinute = Number(value);
            update({
              startMinute,
              endMinute:
                form.endMinute !== null && form.endMinute <= startMinute
                  ? null
                  : form.endMinute,
            });
          }}
        />
        <GroupedTimeSelect
          ariaLabel="End time"
          placeholder="To"
          value={form.endMinute === null ? "" : String(form.endMinute)}
          groups={toGroups}
          onValueChange={(value) => update({ endMinute: Number(value) })}
        />
      </div>
      {length !== null && (
        <p className={styles.editHint}>
          {formatDurationMinutes(length)} session
        </p>
      )}
    </div>
  );
};

const GroupedTimeSelect = ({
  ariaLabel,
  placeholder,
  value,
  groups,
  onValueChange,
}: {
  ariaLabel: string;
  placeholder: string;
  value: string;
  groups: TimeGroup[];
  onValueChange: (value: string) => void;
}) => (
  <Select value={value} onValueChange={(next) => next && onValueChange(next)}>
    <SelectTrigger aria-label={ariaLabel} className={styles.timeSelectTrigger}>
      <SelectValue placeholder={placeholder}>
        {(selected) =>
          selected ? (
            formatTimeOfDay(Number(selected))
          ) : (
            <span className={styles.selectPlaceholder}>{placeholder}</span>
          )
        }
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      {groups.map((group) => (
        <SelectGroup key={group.label || "all"}>
          {group.label && <SelectLabel>{group.label}</SelectLabel>}
          {group.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      ))}
    </SelectContent>
  </Select>
);
