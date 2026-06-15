// Libs
import { format } from "date-fns";
import { formatDurationMinutes, formatTime } from "@/lib/formatters";
import type {
  AcceptInquiryPayload,
  AppointmentType,
  ConsultationFormat,
  Inquiry,
  InquirySchedulingForm,
  OpenBookAvailabilityWindow,
  RequestConsultationPayload,
  RescheduleAppointmentPayload,
  TimeFilter,
} from "@/types/bookings";

export const TIME_STEP_MINUTES = 30;

export interface TimeOption {
  value: string;
  label: string;
}

// A labelled run of time options — "Your hours" surfaced ahead of "Other times".
export interface TimeGroup {
  label: string;
  options: TimeOption[];
}

export const TIME_FILTERS: {
  value: TimeFilter;
  label: string;
  hint: string;
  range: [number, number];
}[] = [
  { value: "any", label: "Any time", hint: "All hours", range: [0, 1440] },
  { value: "morning", label: "Morning", hint: "Before 12pm", range: [0, 720] },
  {
    value: "afternoon",
    label: "Afternoon",
    hint: "12–5pm",
    range: [720, 1020],
  },
  {
    value: "evening",
    label: "Evening",
    hint: "After 5pm",
    range: [1020, 1440],
  },
];

function filterRange(filter: TimeFilter): [number, number] {
  const match = TIME_FILTERS.find((f) => f.value === filter) ?? TIME_FILTERS[0];
  return match.range;
}

/**
 * Groups the day's start times into "Your hours" (inside the artist's weekly
 * windows for the selected day) and "Other times", narrowed to the active
 * time-of-day filter. When the artist has no hours set for that day, a single
 * unlabelled group is returned.
 * @param windows
 * @param date - The date to group the times for.
 * @param filter - The time-of-day filter to use.
 * @param after - The time to start after.
 * @returns The grouped times.
 */
export function groupTimeOptions(
  windows: OpenBookAvailabilityWindow[],
  date: Date,
  filter: TimeFilter,
  after = -1,
): TimeGroup[] {
  const [rangeStart, rangeEnd] = filterRange(filter);
  const dayWindows = windows.filter((w) => w.weekday === date.getDay());
  const isStandard = (minute: number) =>
    dayWindows.some((w) => minute >= w.startMinute && minute < w.endMinute);

  const yourHours: TimeOption[] = [];
  const otherTimes: TimeOption[] = [];
  for (let minute = 0; minute < 1440; minute += TIME_STEP_MINUTES) {
    if (minute < rangeStart || minute >= rangeEnd || minute <= after) continue;
    const option = { value: String(minute), label: formatTime(minute) };
    if (isStandard(minute)) yourHours.push(option);
    else otherTimes.push(option);
  }

  if (dayWindows.length === 0) {
    return otherTimes.length ? [{ label: "", options: otherTimes }] : [];
  }
  const groups: TimeGroup[] = [];
  if (yourHours.length)
    groups.push({ label: "Your hours", options: yourHours });
  if (otherTimes.length) {
    groups.push({ label: "Other times", options: otherTimes });
  }
  return groups;
}

export function createSchedulingForm(inquiry: Inquiry): InquirySchedulingForm {
  return {
    date: null,
    startMinute: null,
    endMinute: null,
    durationMinutes: inquiry.sessionDurationMinutes ?? 120,
    timeFilter: "any",
    consultationDurationMinutes: 30,
    consultationFormat: "in_person",
  };
}

/**
 * Pre-fills the scheduling form from the request's current appointment so the
 * reschedule phase opens on its existing date, time, and (for a session) range.
 * @param inquiry - The inquiry to create the form for.
 * @returns The pre-filled form.
 */
export function createRescheduleForm(inquiry: Inquiry): InquirySchedulingForm {
  const base = createSchedulingForm(inquiry);
  const appointment = inquiry.appointment;
  if (!appointment?.scheduledStart) return base;

  const start = new Date(appointment.scheduledStart);
  const startMinute = start.getHours() * 60 + start.getMinutes();
  const isSession = appointment.type === "session";
  return {
    ...base,
    date: start,
    startMinute,
    endMinute: isSession ? startMinute + appointment.durationMinutes : null,
    durationMinutes: appointment.durationMinutes,
    consultationDurationMinutes: appointment.durationMinutes,
    consultationFormat: appointment.format ?? base.consultationFormat,
  };
}

export function isArtistScheduled(inquiry: Inquiry): boolean {
  return inquiry.schedulingMode === "artist_scheduled";
}

export function canSubmitSchedule(
  inquiry: Inquiry,
  type: AppointmentType,
  form: InquirySchedulingForm,
  pickConcreteTime = false,
): boolean {
  if (!isArtistScheduled(inquiry) && !pickConcreteTime) {
    // Client picks their own start later; the artist only sizes a session.
    return type === "session" ? form.durationMinutes > 0 : true;
  }
  if (!form.date || form.startMinute === null) return false;
  if (type === "consultation") return true;
  return form.endMinute !== null && form.endMinute > form.startMinute;
}

export function buildAcceptPayload(
  inquiry: Inquiry,
  form: InquirySchedulingForm,
): AcceptInquiryPayload {
  if (!isArtistScheduled(inquiry)) {
    return { sessionDurationMinutes: form.durationMinutes };
  }
  const start = form.startMinute ?? 0;
  const end = form.endMinute ?? start;
  return {
    sessionDurationMinutes: end - start,
    scheduledStart: form.date ? combineDateTime(form.date, start) : undefined,
  };
}

export function buildConsultationPayload(
  inquiry: Inquiry,
  form: InquirySchedulingForm,
): RequestConsultationPayload {
  const payload: RequestConsultationPayload = {
    durationMinutes: form.consultationDurationMinutes,
    format: form.consultationFormat,
  };
  if (isArtistScheduled(inquiry) && form.date && form.startMinute !== null) {
    payload.scheduledStart = combineDateTime(form.date, form.startMinute);
  }
  return payload;
}

/**
 * Builds the payload for the reschedule API call.
 * @param inquiry - The inquiry to build the payload for.
 * @param form - The form to build the payload from.
 * @returns The payload for the reschedule API call.
 */
export function buildReschedulePayload(
  inquiry: Inquiry,
  form: InquirySchedulingForm,
): RescheduleAppointmentPayload {
  const start = form.startMinute ?? 0;
  const payload: RescheduleAppointmentPayload = {
    scheduledStart: form.date ? combineDateTime(form.date, start) : "",
  };
  if (inquiry.appointment?.type === "session") {
    payload.durationMinutes = (form.endMinute ?? start) - start;
  } else {
    payload.durationMinutes = form.consultationDurationMinutes;
    payload.format = form.consultationFormat;
  }
  return payload;
}

/**
 * Merges a calendar day and minutes-from-midnight into an ISO timestamp, using
 * the artist's local timezone (the browser's) so it round-trips with display.
 * @param date - The date to merge.
 * @param minute - The minutes from midnight to merge.
 * @returns The merged date and time.
 */
export function combineDateTime(date: Date, minute: number): string {
  const combined = new Date(date);
  combined.setHours(Math.floor(minute / 60), minute % 60, 0, 0);
  return combined.toISOString();
}

export interface ScheduleReview {
  typeLabel: string;
  durationLabel: string;
  clientName: string;
  dateLabel: string;
  timeLabel: string;
  format: ConsultationFormat | null;
}

export function buildScheduleReview(
  inquiry: Inquiry,
  type: AppointmentType,
  form: InquirySchedulingForm,
): ScheduleReview {
  const start = form.startMinute ?? 0;
  const duration =
    type === "session"
      ? (form.endMinute ?? start) - start
      : form.consultationDurationMinutes;

  const consultationFormat =
    type === "consultation" ? form.consultationFormat : null;

  return {
    typeLabel: type === "session" ? "Tattoo session" : "Consultation",
    durationLabel: formatDurationMinutes(duration),
    clientName: inquiry.clientName,
    dateLabel: form.date ? format(form.date, "EEEE, MMMM d, yyyy") : "",
    timeLabel: `${formatTime(start)} – ${formatTime(start + duration)}`,
    format: consultationFormat,
  };
}
