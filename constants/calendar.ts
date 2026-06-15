// Libs
import { CreateAppointmentPhase } from "@/types/calendar";
import { CONSULTATION_LENGTH_OPTIONS } from "@/constants/bookings";
import type { AppointmentType } from "@/types/bookings";

export const CREATE_APPOINTMENT_PHASES = [
  CreateAppointmentPhase.Type,
  CreateAppointmentPhase.Client,
  CreateAppointmentPhase.Schedule,
  CreateAppointmentPhase.Review,
];

export const CREATE_APPOINTMENT_PHASE_META: Record<
  CreateAppointmentPhase,
  { lead: string; rest: string }
> = {
  [CreateAppointmentPhase.Type]: {
    lead: "What are you booking?",
    rest: "Manually add a booking you arranged off-platform.",
  },
  [CreateAppointmentPhase.Client]: {
    lead: "Who's it with?",
    rest: "The client's contact details for this booking.",
  },
  [CreateAppointmentPhase.Schedule]: {
    lead: "When is it?",
    rest: "Pick the date, time, and length.",
  },
  [CreateAppointmentPhase.Review]: {
    lead: "Review.",
    rest: "Confirm the details and add it to your calendar.",
  },
};

export const APPOINTMENT_TYPE_OPTIONS: {
  value: AppointmentType;
  label: string;
  hint: string;
}[] = [
  {
    value: "session",
    label: "Tattoo session",
    hint: "A booked tattoo sitting",
  },
  {
    value: "consultation",
    label: "Consultation",
    hint: "A pre-booking chat",
  },
];

export const CONSULTATION_DURATION_OPTIONS = CONSULTATION_LENGTH_OPTIONS.map(
  (option) => ({ value: String(option.minutes), label: option.title }),
);

export type CalendarTypeFilter = "all" | AppointmentType;

export const CALENDAR_TYPE_FILTER_OPTIONS: {
  value: CalendarTypeFilter;
  label: string;
}[] = [
  { value: "all", label: "All bookings" },
  { value: "session", label: "Tattoo sessions" },
  { value: "consultation", label: "Consultations" },
];
