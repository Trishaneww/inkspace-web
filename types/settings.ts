export type PayoutFrequency = "weekly" | "monthly";
export type PlatformFeePayer = "artist" | "client" | "split";
export type DepositRefundPolicy =
  | "non_refundable"
  | "refundable_within_window"
  | "always_refundable";

export type SettingsTabId =
  | "personal"
  | "email"
  | "payments"
  | "billing"
  | "yourwork"
  | "deposits"
  | "booking"
  | "policies"
  | "notifications";

// ─── Response shapes ────────────────────────────────────────────────────────
export interface SettingsAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  avatarUrl: string;
  instagramUrl: string;
}

export interface ArtistSettings {
  currentLocationId: string;

  stripeConnected: boolean;
  stripeChargesEnabled: boolean;
  stripePayoutsEnabled: boolean;
  stripeDetailsSubmitted: boolean;
  payoutFrequency: PayoutFrequency;
  currency: string;

  depositFlatFeeCents: number | null;
  platformFeePayer: PlatformFeePayer;
  depositRefundPolicy: DepositRefundPolicy;
  cancellationNoticeHours: number | null;

  acceptingBookings: boolean;
  monthlyBookingGoal: number;
  timezone: string;
  googleCalendarConnected: boolean;
  googleCalendarEmail: string;
  slotIntervalMinutes: number;
  bufferMinutes: number;
  minNoticeMinutes: number;
  maxAdvanceDays: number | null;

  termsText: string;
  termsShowOnBooking: boolean;
  termsShowAtDeposit: boolean;
  waiverFileUrl: string;
  waiverRequired: boolean;

  aftercare: string;
  faqs: FaqItem[];

  notifyByEmail: boolean;
  notifyBySms: boolean;

  styles: string[];

  minSessionPriceCents: number | null;
  declinedPlacements: string[];
  declinedStyles: string[];
  workSummary: string;
}

export interface Location {
  id: string;
  label: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  timezone: string;
  isPrimary: boolean;
  startDate: string | null;
  endDate: string | null;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface AvailabilityWindow {
  id: string;
  weekday: number;
  startMinute: number;
  endMinute: number;
}

export interface SessionPreset {
  id: string;
  name: string;
  description: string;
  approxDurationMinutes: number;
  position: number;
}

export interface BlocklistEntry {
  id: string;
  email: string;
  phone: string;
  note: string;
}

export interface SettingsResponse {
  account: SettingsAccount;
  locations: Location[];
  settings: ArtistSettings;
  availability: AvailabilityWindow[];
  sessionPresets: SessionPreset[];
  daysOff: string[];
  blocklist: BlocklistEntry[];
}

export interface CreateLocationPayload {
  label: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  timezone: string;
  startDate: string;
  endDate: string;
}

export interface UpdateLocationPayload {
  label?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  timezone?: string;
  startDate?: string;
  endDate?: string;
  clearDates?: boolean;
}

// ─── Request payloads ───────────────────────────────────────────────────────
export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  avatarUrl?: string;
  instagramUrl?: string;
}

export interface ChangeEmailPayload {
  newEmail: string;
}

export interface ChangePasswordPayload {
  newPassword: string;
}

export interface UpdateSettingsPayload {
  payoutFrequency?: PayoutFrequency;
  currency?: string;
  platformFeePayer?: PlatformFeePayer;
  depositRefundPolicy?: DepositRefundPolicy;
  acceptingBookings?: boolean;
  monthlyBookingGoal?: number;
  timezone?: string;
  slotIntervalMinutes?: number;
  bufferMinutes?: number;
  minNoticeMinutes?: number;
  termsText?: string;
  termsShowOnBooking?: boolean;
  termsShowAtDeposit?: boolean;
  waiverRequired?: boolean;
  aftercare?: string;
  faqs?: FaqItem[];
  notifyByEmail?: boolean;
  notifyBySms?: boolean;
  styles?: string[];

  depositFlatFeeCents?: number | null;
  clearDepositFlatFee?: boolean;
  maxAdvanceDays?: number | null;
  clearMaxAdvance?: boolean;
  waiverFileUrl?: string;
  clearWaiverFile?: boolean;
  cancellationNoticeHours?: number | null;
  clearCancellationNotice?: boolean;

  minSessionPriceCents?: number | null;
  clearMinSessionPrice?: boolean;
  declinedPlacements?: string[];
  declinedStyles?: string[];
  workSummary?: string;
}

export interface AvailabilityWindowInput {
  weekday: number;
  startMinute: number;
  endMinute: number;
}

export interface CreatePresetPayload {
  name: string;
  description: string;
  approxDurationMinutes: number;
  position: number;
}

export interface UpdatePresetPayload {
  name?: string;
  description?: string;
  approxDurationMinutes?: number;
  position?: number;
}

export interface CreateBlocklistPayload {
  email?: string;
  phone?: string;
  note: string;
}

export interface ConnectGoogleCalendarPayload {
  code: string;
  redirectUri: string;
}

export interface PresignUploadResponse {
  url: string;
  s3Key: string;
  expiresAt: string;
}

export interface StripeConnectResponse {
  url: string;
}
