// HTML Components
import {
  Ban,
  CalendarClock,
  CalendarPlus,
  Check,
  DollarSign,
  Undo2,
  X,
} from "lucide-react";

// Libs
import type {
  BadgeMeta,
  BookingFilters,
  DepositStatus,
  InquiryAction,
  InquiryStatus,
  RecencyFilter,
  RequestType,
  SortOrder,
  StatusFilter,
  WaiverStatus,
} from "@/types/booking";
import type { Inquiry } from "@/types/booking";

export const STATUS_META: Record<InquiryStatus, BadgeMeta> = {
  pending: { label: "New", variant: "pending" },
  consultation_requested: { label: "Consultation", variant: "warning" },
  accepted: { label: "Accepted", variant: "success" },
  declined: { label: "Declined", variant: "failure" },
  expired: { label: "Expired", variant: "inactive" },
  converted: { label: "Booked", variant: "success" },
};

export const DEPOSIT_META: Record<DepositStatus, BadgeMeta> = {
  not_required: { label: "Not required", variant: "neutral" },
  pending: { label: "Pending", variant: "warning" },
  paid: { label: "Paid", variant: "success" },
  refunded: { label: "Refunded", variant: "inactive" },
};

export const WAIVER_META: Record<WaiverStatus, BadgeMeta> = {
  not_required: { label: "Not required", variant: "neutral" },
  pending: { label: "Pending", variant: "warning" },
  signed: { label: "Signed", variant: "success" },
};

export const TYPE_LABELS: Record<RequestType, string> = {
  flash: "Flash",
  custom: "Custom",
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
  { value: "accepted", label: "Accepted" },
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

const isActiveBooking = (status: InquiryStatus) =>
  status === "accepted" || status === "converted";

export const INQUIRY_ACTIONS: InquiryAction[] = [
  {
    id: "accept",
    label: "Accept",
    icon: Check,
    isAvailable: (i: Inquiry) => isUndecided(i.status),
  },
  {
    id: "decline",
    label: "Decline",
    icon: X,
    destructive: true,
    isAvailable: (i: Inquiry) => isUndecided(i.status),
  },
  {
    id: "book_consultation",
    label: "Book consultation",
    icon: CalendarPlus,
    isAvailable: (i: Inquiry) => isUndecided(i.status),
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
    isAvailable: (i: Inquiry) => isActiveBooking(i.status),
  },
  {
    id: "cancel",
    label: "Cancel booking",
    icon: Ban,
    destructive: true,
    isAvailable: (i: Inquiry) => isActiveBooking(i.status),
  },
  {
    id: "reopen",
    label: "Undo decline",
    icon: Undo2,
    isAvailable: (i: Inquiry) => i.status === "declined",
  },
];
