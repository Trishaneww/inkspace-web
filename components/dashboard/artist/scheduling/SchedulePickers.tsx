"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Libs
import {
  groupTimeOptions,
  TIME_FILTERS,
  type TimeGroup,
} from "@/lib/inquiryScheduling";
import { formatDurationMinutes, formatTime } from "@/lib/formatters";
import type { OpenBookAvailabilityWindow, TimeFilter } from "@/types/bookings";

export const TimeOfDayFilter = ({
  value,
  onChange,
}: {
  value: TimeFilter;
  onChange: (filter: TimeFilter) => void;
}) => (
  <div className={styles.timeFilterRow}>
    {TIME_FILTERS.map((filter) => (
      <Button
        key={filter.value}
        variant="bare"
        size="bare"
        type="button"
        className={clsx(styles.timeFilterBtn, {
          [styles.timeFilterBtnActive]: value === filter.value,
        })}
        onClick={() => onChange(filter.value)}
      >
        <span className={styles.timeFilterLabel}>{filter.label}</span>
        <span className={styles.timeFilterHint}>{filter.hint}</span>
      </Button>
    ))}
  </div>
);

export const ConsultationTimeChips = ({
  availability,
  date,
  timeFilter,
  durationMinutes,
  selected,
  onSelect,
}: {
  availability: OpenBookAvailabilityWindow[];
  date: Date;
  timeFilter: TimeFilter;
  durationMinutes: number;
  selected: number | null;
  onSelect: (minute: number) => void;
}) => {
  const groups = groupTimeOptions(availability, date, timeFilter);

  return (
    <div className={styles.scheduleSection}>
      <span className={styles.toggleLabel}>
        Pick a time · {formatDurationMinutes(durationMinutes)}
      </span>
      {groups.length === 0 ? (
        <p className={styles.scheduleNote}>No times in this range.</p>
      ) : (
        groups.map((group) => (
          <TimeChipGroup
            key={group.label || "all"}
            group={group}
            selected={selected}
            onSelect={onSelect}
          />
        ))
      )}
    </div>
  );
};

export const SessionTimeRange = ({
  availability,
  date,
  timeFilter,
  startMinute,
  endMinute,
  onChange,
}: {
  availability: OpenBookAvailabilityWindow[];
  date: Date;
  timeFilter: TimeFilter;
  startMinute: number | null;
  endMinute: number | null;
  onChange: (patch: {
    startMinute?: number;
    endMinute?: number | null;
  }) => void;
}) => {
  const fromGroups = groupTimeOptions(availability, date, timeFilter);
  const toGroups = groupTimeOptions(
    availability,
    date,
    timeFilter,
    startMinute ?? -1,
  );
  const length =
    startMinute !== null && endMinute !== null && endMinute > startMinute
      ? endMinute - startMinute
      : null;

  return (
    <div className={styles.scheduleSection}>
      <span className={styles.toggleLabel}>Time</span>
      <div className={styles.timeRangeRow}>
        <GroupedTimeSelect
          ariaLabel="Start time"
          placeholder="From"
          value={startMinute === null ? "" : String(startMinute)}
          groups={fromGroups}
          onValueChange={(value) => {
            const nextStart = Number(value);
            onChange({
              startMinute: nextStart,
              endMinute:
                endMinute !== null && endMinute <= nextStart ? null : endMinute,
            });
          }}
        />
        <GroupedTimeSelect
          ariaLabel="End time"
          placeholder="To"
          value={endMinute === null ? "" : String(endMinute)}
          groups={toGroups}
          onValueChange={(value) => onChange({ endMinute: Number(value) })}
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
          <Button
            key={option.value}
            variant="bare"
            size="bare"
            type="button"
            className={clsx(styles.timeChip, {
              [styles.timeChipActive]: selected === minute,
            })}
            onClick={() => onSelect(minute)}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  </div>
);

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
            formatTime(Number(selected))
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
