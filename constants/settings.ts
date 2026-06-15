// Libs
import { formatTime } from "@/lib/formatters";
import type {
  DepositRefundPolicy,
  PayoutFrequency,
  PlatformFeePayer,
  SettingsTabId,
} from "@/types/settings";

interface Option<TValue> {
  value: TValue;
  label: string;
  description?: string;
}

export interface SettingsTab {
  id: SettingsTabId;
  label: string;
}

export const SETTINGS_TABS: SettingsTab[] = [
  { id: "personal", label: "Personal Info" },
  { id: "email", label: "Email & Password" },
  { id: "payments", label: "Payments & Payouts" },
  { id: "deposits", label: "Deposits" },
  { id: "booking", label: "Booking Preferences" },
  { id: "policies", label: "Terms & Waiver" },
  { id: "notifications", label: "Notifications & Messaging" },
];

export const PAYOUT_FREQUENCY_OPTIONS: Option<PayoutFrequency>[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export const FEE_PAYER_OPTIONS: Option<PlatformFeePayer>[] = [
  { value: "client", label: "Client covers" },
  { value: "artist", label: "I cover it" },
  { value: "split", label: "50 / 50 split" },
];

export const REFUND_POLICY_OPTIONS: Option<DepositRefundPolicy>[] = [
  { value: "non_refundable", label: "Non-refundable" },
  { value: "refundable_within_window", label: "Refundable within a window" },
  { value: "always_refundable", label: "Always refundable" },
];

export const CURRENCY_OPTIONS: Option<string>[] = [
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "AUD", label: "AUD — Australian Dollar" },
];

export const SLOT_INTERVAL_OPTIONS: Option<number>[] = [
  { value: 60, label: "Every 60 minutes" },
  { value: 30, label: "Every 30 minutes" },
  { value: 15, label: "Every 15 minutes" },
];

export const BUFFER_OPTIONS: Option<number>[] = [
  { value: 0, label: "No buffer" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
];

export const MIN_NOTICE_OPTIONS: Option<number>[] = [
  { value: 0, label: "Same day" },
  { value: 1440, label: "1 day in advance" },
  { value: 2880, label: "2 days in advance" },
  { value: 4320, label: "3 days in advance" },
  { value: 10080, label: "1 week in advance" },
];

export const MAX_ADVANCE_OPTIONS: Option<number | null>[] = [
  { value: null, label: "No limit" },
  { value: 30, label: "30 days" },
  { value: 60, label: "60 days" },
  { value: 90, label: "90 days" },
  { value: 180, label: "6 months" },
  { value: 365, label: "1 year" },
];

export const MAX_ADVANCE_SELECT_OPTIONS = MAX_ADVANCE_OPTIONS.map((o) => ({
  value: o.value === null ? "none" : String(o.value),
  label: o.label,
}));

export interface Weekday {
  value: number;
  label: string;
  short: string;
}

export const WEEKDAYS: Weekday[] = [
  { value: 1, label: "Monday", short: "Mon" },
  { value: 2, label: "Tuesday", short: "Tue" },
  { value: 3, label: "Wednesday", short: "Wed" },
  { value: 4, label: "Thursday", short: "Thu" },
  { value: 5, label: "Friday", short: "Fri" },
  { value: 6, label: "Saturday", short: "Sat" },
  { value: 0, label: "Sunday", short: "Sun" },
];

export const TIMEZONE_OPTIONS: Option<string>[] = [
  { value: "America/Vancouver", label: "Pacific — Vancouver / Los Angeles" },
  { value: "America/Edmonton", label: "Mountain — Edmonton / Denver" },
  { value: "America/Chicago", label: "Central — Chicago / Winnipeg" },
  { value: "America/Toronto", label: "Eastern — Toronto / New York" },
  { value: "America/Halifax", label: "Atlantic — Halifax" },
  { value: "Europe/London", label: "London — GMT/BST" },
  { value: "Europe/Paris", label: "Central Europe — Paris / Berlin" },
  { value: "Australia/Sydney", label: "Sydney — AEST/AEDT" },
];

export const AVAILABILITY_DEFAULT_START_MINUTE = 540; // 9:00 AM
export const AVAILABILITY_DEFAULT_END_MINUTE = 1020; // 5:00 PM

const AVAILABILITY_ALL_TIME_OPTIONS = Array.from(
  { length: 49 },
  (_, i) => i * 30,
).map((m) => ({ value: String(m), label: formatTime(m) }));

export const AVAILABILITY_START_TIME_OPTIONS =
  AVAILABILITY_ALL_TIME_OPTIONS.filter((o) => Number(o.value) < 1440);
export const AVAILABILITY_END_TIME_OPTIONS =
  AVAILABILITY_ALL_TIME_OPTIONS.filter((o) => Number(o.value) > 0);
