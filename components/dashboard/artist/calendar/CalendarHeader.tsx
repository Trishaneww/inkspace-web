"use client";

// CSS
import styles from "@/styles/dashboard/artist/Calendar.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

// Libs
import { formatSelectValue } from "@/lib/formatters";
import { CALENDAR_TYPE_FILTER_OPTIONS } from "@/constants/calendar";

// Types
import type { CalendarTypeFilter } from "@/constants/calendar";
import type { CalendarView } from "@/types/calendar";

const VIEW_OPTIONS: { value: CalendarView; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

interface CalendarHeaderProps {
  title: string;
  view: CalendarView;
  showViewToggle: boolean;
  typeFilter: CalendarTypeFilter;
  onTypeFilterChange: (filter: CalendarTypeFilter) => void;
  onViewChange: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onNewAppointment: () => void;
}

export const CalendarHeader = ({
  title,
  view,
  showViewToggle,
  typeFilter,
  onTypeFilterChange,
  onViewChange,
  onPrev,
  onNext,
  onNewAppointment,
}: CalendarHeaderProps) => (
  <div className={styles.header}>
    <div className={styles.headerTop}>
      <h1 className={styles.title}>Calendar</h1>
      <span className={styles.subtitle}>
        View and manage your bookings and consultations
      </span>
    </div>

    <div className={styles.toolbar}>
      <div className={styles.toolbarLeft}>
        <div className={styles.nav}>
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous"
            onClick={onPrev}
          >
            <ChevronLeft />
          </Button>
          <span className={styles.rangeLabel}>{title}</span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next"
            onClick={onNext}
          >
            <ChevronRight />
          </Button>
        </div>

        <Select
          value={typeFilter}
          onValueChange={(next) =>
            next && onTypeFilterChange(next as CalendarTypeFilter)
          }
        >
          <SelectTrigger aria-label="Filter by booking type">
            <SelectValue>
              {(value) =>
                value == null
                  ? null
                  : formatSelectValue(
                      value as string,
                      CALENDAR_TYPE_FILTER_OPTIONS,
                    )
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {CALENDAR_TYPE_FILTER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {showViewToggle && (
          <Select
            value={view}
            onValueChange={(next) => next && onViewChange(next as CalendarView)}
          >
            <SelectTrigger aria-label="Calendar view">
              <SelectValue>
                {(value) =>
                  value == null
                    ? null
                    : formatSelectValue(value as string, VIEW_OPTIONS)
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {VIEW_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className={styles.toolbarRight}>
        <Button className={styles.newBtn} onClick={onNewAppointment}>
          <Plus size={16} />
          New booking
        </Button>
      </div>
    </div>
  </div>
);
