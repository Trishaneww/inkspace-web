// Libs
import type {
  AppointmentStatus,
  AppointmentType,
  ConsultationFormat,
  TimeFilter,
} from "@/types/bookings";

export type CalendarView = "day" | "week" | "month";

export enum CreateAppointmentPhase {
  Type,
  Client,
  Schedule,
  Review,
}

export interface ManualAppointmentForm {
  type: AppointmentType;
  format: ConsultationFormat;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  locationId: string;
  date: Date | null;
  timeFilter: TimeFilter;
  startMinute: number | null;
  endMinute: number | null;
  consultationDurationMinutes: number;
  placement: string;
  approxSizeInches: string;
  colorType: string;
  description: string;
  depositAmount: string;
}

export interface CreateAppointmentPayload {
  type: AppointmentType;
  format?: ConsultationFormat;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  scheduledStart: string;
  durationMinutes: number;
  locationId?: string;
  placement: string;
  approxSizeInches?: number;
  colorType: string;
  description: string;
  depositAmountCents?: number;
}

export interface CalendarEvent {
  id: string;
  bookingRequestId: string;
  type: AppointmentType;
  status: AppointmentStatus;
  clientName: string;
  locationLabel: string;
  locationAddress: string;
  scheduledStart: string;
  durationMinutes: number;
  format?: ConsultationFormat;
}

export interface PositionedEvent {
  event: CalendarEvent;
  startMinute: number;
  endMinute: number;
  lane: number;
  laneCount: number;
}
