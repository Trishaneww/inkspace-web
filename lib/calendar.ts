// Libs
import {
  addDays,
  addMinutes,
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  COLOR_TYPE_LABELS,
  CONSULTATION_FORMAT_LABELS,
} from "@/constants/bookings";
import { formatTime } from "@/lib/formatters";

// Types
import type {
  CalendarEvent,
  CalendarView,
  ManualAppointmentForm,
  PositionedEvent,
} from "@/types/calendar";

const WEEK_STARTS_ON = 0;

export const HOUR_HEIGHT_PX = 56;
export const MINUTE_HEIGHT_PX = HOUR_HEIGHT_PX / 60;

export const HOUR_WIDTH_PX = 168;
export const MINUTE_WIDTH_PX = HOUR_WIDTH_PX / 60;
export const LANE_HEIGHT_PX = 58;

export const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"];

export function getCalendarRange(
  view: CalendarView,
  anchor: Date,
): { start: Date; end: Date } {
  if (view === "day") {
    const startDate = startOfDay(anchor);
    return { start: startDate, end: addDays(startDate, 1) };
  }
  if (view === "week") {
    const start = startOfWeek(anchor, { weekStartsOn: WEEK_STARTS_ON });
    return { start, end: addDays(start, 7) };
  }
  const gridStart = startOfWeek(startOfMonth(anchor), {
    weekStartsOn: WEEK_STARTS_ON,
  });
  const lastWeekStart = startOfWeek(endOfMonth(anchor), {
    weekStartsOn: WEEK_STARTS_ON,
  });
  return { start: gridStart, end: addDays(lastWeekStart, 7) };
}

export function getViewDays(view: CalendarView, anchor: Date): Date[] {
  if (view === "day") return [startOfDay(anchor)];
  const startDate = startOfWeek(anchor, { weekStartsOn: WEEK_STARTS_ON });
  return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
}

export function getMonthWeeks(anchor: Date): Date[][] {
  const { start, end } = getCalendarRange("month", anchor);
  const weeks: Date[][] = [];
  let cursor = start;
  while (cursor < end) {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(cursor, i)));
    cursor = addDays(cursor, 7);
  }
  return weeks;
}

export function shiftAnchor(
  view: CalendarView,
  anchor: Date,
  direction: 1 | -1,
): Date {
  if (view === "day") return addDays(anchor, direction);
  if (view === "week") return addDays(anchor, direction * 7);
  return addMonths(anchor, direction);
}

export function formatViewTitle(view: CalendarView, anchor: Date): string {
  if (view === "day") return format(anchor, "EEEE, MMMM d");
  if (view === "month") return format(anchor, "MMMM yyyy");

  const startDate = startOfWeek(anchor, { weekStartsOn: WEEK_STARTS_ON });
  const endDate = addDays(startDate, 6);
  if (isSameMonth(startDate, endDate)) {
    return `${format(startDate, "MMM d")} - ${format(endDate, "d, yyyy")}`;
  }
  return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
}

export function formatHourLabel(hour: number): string {
  const period = hour < 12 ? "AM" : "PM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display} ${period}`;
}

export function formatEventTimeRange(event: CalendarEvent): string {
  const startDate = new Date(event.scheduledStart);
  const endDate = addMinutes(startDate, event.durationMinutes);
  return `${formatTime(minutesSinceMidnight(startDate), true)} - ${formatTime(minutesSinceMidnight(endDate), true)}`;
}

export function describeCalendarEvent(event: CalendarEvent): {
  typeLabel: string;
  detail: string;
} {
  if (event.type === "consultation") {
    return {
      typeLabel: "Consultation",
      detail: event.format ? CONSULTATION_FORMAT_LABELS[event.format] : "",
    };
  }
  return {
    typeLabel: "Tattoo session",
    detail: event.locationAddress || event.locationLabel,
  };
}

export function getEventDetails(event: CalendarEvent): {
  typeLabel: string;
  location: string;
  formatLabel: string;
} {
  const location = event.locationAddress || event.locationLabel || "";
  if (event.type === "consultation") {
    return {
      typeLabel: "Consultation",
      location,
      formatLabel: event.format ? CONSULTATION_FORMAT_LABELS[event.format] : "",
    };
  }
  return { typeLabel: "Tattoo session", location, formatLabel: "" };
}

export function isEventActive(event: CalendarEvent, now: Date): boolean {
  const startDate = new Date(event.scheduledStart);
  const endDate = addMinutes(startDate, event.durationMinutes);
  return now >= startDate && now < endDate;
}

export function eventsForDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  return events.filter((event) =>
    isSameDay(new Date(event.scheduledStart), day),
  );
}

export function minutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function layoutDay(events: CalendarEvent[]): PositionedEvent[] {
  const items = events
    .map((event) => {
      const startMinute = minutesSinceMidnight(new Date(event.scheduledStart));
      return {
        event,
        startMinute,
        endMinute: startMinute + event.durationMinutes,
        lane: 0,
      };
    })
    .sort((a, b) => a.startMinute - b.startMinute || a.endMinute - b.endMinute);

  const positioned: PositionedEvent[] = [];
  let cluster: typeof items = [];
  let laneEnds: number[] = [];
  let clusterEnd = -1;

  const flushCluster = () => {
    const laneCount = laneEnds.length || 1;
    for (const item of cluster) positioned.push({ ...item, laneCount });
    cluster = [];
    laneEnds = [];
    clusterEnd = -1;
  };

  for (const item of items) {
    if (cluster.length > 0 && item.startMinute >= clusterEnd) flushCluster();

    let lane = laneEnds.findIndex((end) => end <= item.startMinute);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(item.endMinute);
    } else {
      laneEnds[lane] = item.endMinute;
    }

    cluster.push({ ...item, lane });
    clusterEnd = Math.max(clusterEnd, item.endMinute);
  }
  flushCluster();

  return positioned;
}

export function describeFormPiece(form: ManualAppointmentForm): string {
  const parts = [
    form.placement.trim(),
    form.approxSizeInches.trim() ? `${form.approxSizeInches.trim()}"` : "",
    form.colorType ? (COLOR_TYPE_LABELS[form.colorType] ?? form.colorType) : "",
  ].filter(Boolean);
  return parts.join(" · ");
}
