// HTML Components
import {
  Ban,
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  DollarSign,
  Undo2,
  X,
} from "lucide-react";

// Libs
import type {
  AppointmentStatus,
  AppointmentType,
  BadgeMeta,
  BookingFilters,
  ConsultationFormat,
  DepositStatus,
  InquiryAction,
  InquiryStatus,
  RecencyFilter,
  RequestType,
  SortOrder,
  StatusFilter,
  WaiverStatus,
} from "@/types/bookings";
import type { Inquiry } from "@/types/bookings";

export const STATUS_META: Record<InquiryStatus, BadgeMeta> = {
  pending: { label: "New", variant: "pending" },
  consultation_requested: { label: "Consultation", variant: "warning" },
  accepted: { label: "Scheduled", variant: "success" },
  declined: { label: "Declined", variant: "failure" },
  expired: { label: "Expired", variant: "inactive" },
  converted: { label: "Booked", variant: "success" },
  cancelled: { label: "Cancelled", variant: "failure" },
};

export const DEPOSIT_META: Record<DepositStatus, BadgeMeta> = {
  not_required: { label: "Not required", variant: "neutral" },
  pending: { label: "Pending", variant: "warning" },
  paid: { label: "Paid", variant: "success" },
  refunded: { label: "Refunded", variant: "inactive" },
};

export const APPOINTMENT_STATUS_META: Record<AppointmentStatus, BadgeMeta> = {
  proposed: { label: "Proposed", variant: "pending" },
  scheduled: { label: "Scheduled", variant: "success" },
  completed: { label: "Completed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "failure" },
  no_show: { label: "No-show", variant: "failure" },
};

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  consultation: "Consultation",
  session: "Session",
};

export const CONSULTATION_FORMAT_LABELS: Record<ConsultationFormat, string> = {
  in_person: "In person",
  online: "Online",
  phone: "Phone",
};

export const CONSULTATION_LENGTH_OPTIONS: {
  minutes: number;
  title: string;
  description: string;
  recommended?: boolean;
}[] = [
  {
    minutes: 30,
    title: "30 minutes",
    description: "A quick chat about the idea",
    recommended: true,
  },
  {
    minutes: 45,
    title: "45 minutes",
    description: "Talk through detail and placement",
  },
  {
    minutes: 60,
    title: "1 hour",
    description: "An in-depth first consultation",
  },
];

export const CONSULTATION_FORMAT_OPTIONS: {
  value: ConsultationFormat;
  label: string;
  hint: string;
}[] = [
  { value: "in_person", label: "In person", hint: "At the studio" },
  { value: "online", label: "Online", hint: "Video call" },
  { value: "phone", label: "Phone", hint: "Phone call" },
];

export const WAIVER_META: Record<WaiverStatus, BadgeMeta> = {
  not_required: { label: "Not required", variant: "neutral" },
  pending: { label: "Pending", variant: "warning" },
  signed: { label: "Signed", variant: "success" },
};

export const TYPE_LABELS: Record<RequestType, string> = {
  flash: "Flash",
  custom: "Custom",
};

export const COLOR_TYPE_LABELS: Record<string, string> = {
  black_and_grey: "Black & grey",
  color: "Color",
  either: "Either / not sure",
};

export const EMPTY_BOOKING_FILTERS: BookingFilters = {
  search: "",
  status: "all",
  recency: "all",
  sort: "newest",
};

export const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "New" },
  { value: "consultation_requested", label: "Consultation" },
  { value: "accepted", label: "Scheduled" },
  { value: "declined", label: "Declined" },
  { value: "converted", label: "Booked" },
];

export const RECENCY_FILTER_OPTIONS: { value: RecencyFilter; label: string }[] =
  [
    { value: "all", label: "Any time" },
    { value: "24h", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
  ];

export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];

const isUndecided = (status: InquiryStatus) =>
  status === "pending" || status === "consultation_requested";

const hasLiveAppointment = (i: Inquiry) =>
  i.appointment?.status === "scheduled" || i.appointment?.status === "proposed";

export const INQUIRY_ACTIONS: InquiryAction[] = [
  {
    id: "accept",
    label: "Create booking",
    icon: CalendarCheck,
    isAvailable: (i: Inquiry) => isUndecided(i.status),
  },
  {
    id: "decline",
    label: "Decline",
    icon: X,
    destructive: true,
    isAvailable: (i: Inquiry) => isUndecided(i.status) && !hasLiveAppointment(i),
  },
  {
    id: "book_consultation",
    label: "Request consultation",
    icon: CalendarPlus,
    isAvailable: (i: Inquiry) => i.status === "pending" && !hasLiveAppointment(i),
  },
  {
    id: "request_deposit",
    label: "Request deposit",
    icon: DollarSign,
    isAvailable: (i: Inquiry) =>
      i.status === "accepted" &&
      i.depositStatus !== "paid" &&
      i.depositStatus !== "refunded",
  },
  {
    id: "reschedule",
    label: "Reschedule",
    icon: CalendarClock,
    isAvailable: (i: Inquiry) => i.appointment?.status === "scheduled",
  },
  {
    id: "cancel",
    label: "Cancel booking",
    icon: Ban,
    destructive: true,
    isAvailable: (i: Inquiry) => hasLiveAppointment(i),
  },
  {
    id: "reopen",
    label: (i: Inquiry) =>
      i.status === "cancelled" ? "Reopen" : "Undo decline",
    icon: Undo2,
    isAvailable: (i: Inquiry) =>
      i.status === "declined" || i.status === "cancelled",
  },
];

export const SESSION_DURATION_OPTIONS: { value: string; label: string }[] = [
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
  { value: "180", label: "3 hours" },
  { value: "240", label: "4 hours" },
  { value: "300", label: "5 hours" },
  { value: "360", label: "6 hours" },
  { value: "480", label: "Full day (8 hours)" },
];

export const BOOKING_PLACEMENTS = [
  "Forearm",
  "Upper arm",
  "Shoulder",
  "Back",
  "Chest",
  "Ribs",
  "Stomach",
  "Thigh",
  "Calf",
  "Ankle",
  "Foot",
  "Hand",
  "Neck",
  "Other",
] as const;

export const PLACEMENT_OTHER = "Other";

export const BOOKING_COLOR_TYPES: { value: string; label: string }[] = [
  { value: "black_and_grey", label: "Black & grey" },
  { value: "color", label: "Color" },
  { value: "either", label: "Either / not sure" },
];
