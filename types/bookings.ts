// Libs
import type { LucideIcon } from "lucide-react";

export type RequestType = "flash" | "custom";

export type InquiryStatus =
  | "pending"
  | "consultation_requested"
  | "accepted"
  | "declined"
  | "expired"
  | "converted"
  | "cancelled";

export type DepositStatus = "not_required" | "pending" | "paid" | "refunded";
export type WaiverStatus = "not_required" | "pending" | "signed";

export type SchedulingMode = "artist_scheduled" | "client_scheduled";

export type ConsultationFormat = "in_person" | "online" | "phone";

export type AppointmentType = "consultation" | "session";

export type AppointmentStatus =
  | "proposed"
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";

export type SchedulingOrigin = "artist_set" | "client_booked";

export interface Appointment {
  id: string;
  type: AppointmentType;
  status: AppointmentStatus;
  scheduledStart?: string;
  durationMinutes: number;
  format?: ConsultationFormat;
  schedulingOrigin: SchedulingOrigin;
}

export type TimeFilter = "any" | "morning" | "afternoon" | "evening";

export interface InquirySchedulingForm {
  date: Date | null;
  startMinute: number | null;
  endMinute: number | null;
  durationMinutes: number;
  timeFilter: TimeFilter;
  consultationDurationMinutes: number;
  consultationFormat: ConsultationFormat;
}

export interface CustomAnswer {
  prompt: string;
  answer: string;
}

export interface InquiryLocation {
  label: string;
  address: string;
  city: string;
  country: string;
  isPrimary: boolean;
  startDate?: string;
  endDate?: string;
}

export interface InquiryFlash {
  title: string;
  imageUrls: string[];
  sizeCode?: string;
}

export interface Inquiry {
  id: string;
  type: RequestType;
  flashId?: string;
  description: string;
  referenceImageKeys: string[];
  referenceImageUrls: string[];
  placement: string;
  approxSizeInches?: number;
  colorType: string;
  location: InquiryLocation | null;
  flash?: InquiryFlash;
  styles: string[];
  clientAvailability: unknown;
  customAnswers: CustomAnswer[];
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  status: InquiryStatus;
  depositStatus: DepositStatus;
  waiverStatus: WaiverStatus;
  sessionDurationMinutes?: number;
  createdAt: string;
  decidedAt?: string;
  schedulingMode: SchedulingMode;
  artistAvailability: OpenBookAvailabilityWindow[];
  appointment?: Appointment;
  liveAppointments: Appointment[];
}

export interface AcceptInquiryPayload {
  sessionDurationMinutes: number;
  scheduledStart?: string;
}

export interface RequestConsultationPayload {
  scheduledStart?: string;
  durationMinutes?: number;
  format?: ConsultationFormat;
}

export interface RescheduleAppointmentPayload {
  scheduledStart: string;
  durationMinutes?: number;
  format?: ConsultationFormat;
}

export interface BookingStats {
  newInquiries: number;
  awaitingDeposit: number;
  bookedThisMonth: number;
}

export interface InquiryListResponse {
  inquiries: Inquiry[];
  stats: BookingStats;
}

export interface OpenBook {
  slug: string;
  schedulingMode: SchedulingMode;
  customQuestions: string[];
}

export interface UpdateOpenBookPayload {
  slug?: string;
  schedulingMode?: SchedulingMode;
  customQuestions?: string[];
}

export interface OpenBookFaq {
  question: string;
  answer: string;
}

export interface OpenBookAvailabilityWindow {
  weekday: number;
  startMinute: number;
  endMinute: number;
}

export interface OpenBookProfile {
  username: string;
  artistId: string;
  hasFlashes: boolean;
  displayName: string;
  avatarUrl: string;
  location: string;
  instagramUrl: string;
  acceptingBookings: boolean;
  schedulingMode: SchedulingMode;
  styles: string[];
  customQuestions: string[];
  aftercare: string;
  faqs: OpenBookFaq[];
  availability: OpenBookAvailabilityWindow[];
  locations: OpenBookLocation[];
}

export interface OpenBookLocation {
  id: string;
  label: string;
  city: string;
  country: string;
  isPrimary: boolean;
  isCurrent: boolean;
  startDate: string | null;
  endDate: string | null;
}

export interface OpenBookCustomAnswer {
  prompt: string;
  answer: string;
}

export interface CreateBookingRequestPayload {
  locationId: string;
  flashId?: string;
  sizeCode?: string;
  description: string;
  referenceImageKeys: string[];
  placement: string;
  approxSizeInches?: number;
  colorType: string;
  styles: string[];
  customAnswers: OpenBookCustomAnswer[];
  clientAvailability: OpenBookAvailabilityWindow[];
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

export interface CreateBookingRequestResult {
  id: string;
  status: string;
  createdAt: string;
}

export interface PresignReferenceResult {
  url: string;
  key: string;
  expiresAt: string;
}

export type BadgeVariant =
  | "pending"
  | "success"
  | "warning"
  | "failure"
  | "neutral"
  | "inactive";

export interface BadgeMeta {
  label: string;
  variant: BadgeVariant;
}

export type StatusFilter = "all" | InquiryStatus;
export type RecencyFilter = "all" | "24h" | "7d" | "30d";
export type SortOrder = "newest" | "oldest";

export interface BookingFilters {
  search: string;
  status: StatusFilter;
  recency: RecencyFilter;
  sort: SortOrder;
}

export type InquiryActionId =
  | "accept"
  | "request_deposit"
  | "book_consultation"
  | "reschedule"
  | "decline"
  | "cancel"
  | "reopen";

export interface InquiryAction {
  id: InquiryActionId;
  label: string | ((inquiry: Inquiry) => string);
  icon: LucideIcon;
  destructive?: boolean;
  isAvailable: (inquiry: Inquiry) => boolean;
}

export interface ResolvedInquiryAction {
  id: InquiryActionId;
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
}
