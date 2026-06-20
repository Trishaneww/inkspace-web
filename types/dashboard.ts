// Types
import type { AppointmentType, RequestType } from "./bookings";

export interface DashboardPipeline {
  newInquiries: number;
  awaitingDeposit: number;
  scheduled: number;
  leadsThisMonth: number;
  leadsLastMonth: number;
}

export interface DashboardBookingMix {
  custom: number;
  flash: number;
  prevPeriod: number;
}

export type DashboardRange = "1m" | "6m" | "1y" | "all";

export interface DashboardMonthPoint {
  label: string;
  netCents: number;
  collectedCents: number;
}

export interface DashboardEarnings {
  thisPeriodNetCents: number;
  prevPeriodNetCents: number;
  thisPeriodCollectedCents: number;
  prevPeriodCollectedCents: number;
  months: DashboardMonthPoint[];
}

export interface DashboardUpcomingAppointment {
  id: string;
  type: AppointmentType;
  scheduledStart: string;
  durationMinutes: number;
  clientName: string;
  clientEmail: string;
  requestType: RequestType;
}

export interface Dashboard {
  currency: string;
  pipeline: DashboardPipeline;
  mix: DashboardBookingMix;
  earnings: DashboardEarnings;
  upcoming: DashboardUpcomingAppointment[];
}
