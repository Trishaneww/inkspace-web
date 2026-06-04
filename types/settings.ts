export type PayoutFrequency = "weekly" | "biweekly" | "monthly";
export type PlatformFeePayer = "artist" | "client" | "split";

export type SettingsTabId =
  | "personal"
  | "email"
  | "payments"
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
  studioName: string;
  studioAddress: string;
  studioCity: string;
  studioProvince: string;
  studioPostalCode: string;
  studioCountry: string;

  stripeConnected: boolean;
  payoutFrequency: PayoutFrequency;
  currency: string;

  depositFlatFeeCents: number | null;
  platformFeePayer: PlatformFeePayer;

  acceptingBookings: boolean;
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

  notifyByEmail: boolean;
  notifyBySms: boolean;
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
  settings: ArtistSettings;
  availability: AvailabilityWindow[];
  sessionPresets: SessionPreset[];
  daysOff: string[]; 
  blocklist: BlocklistEntry[];
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
  studioName?: string;
  studioAddress?: string;
  studioCity?: string;
  studioProvince?: string;
  studioPostalCode?: string;
  studioCountry?: string;
  payoutFrequency?: PayoutFrequency;
  currency?: string;
  platformFeePayer?: PlatformFeePayer;
  acceptingBookings?: boolean;
  timezone?: string;
  slotIntervalMinutes?: number;
  bufferMinutes?: number;
  minNoticeMinutes?: number;
  termsText?: string;
  termsShowOnBooking?: boolean;
  termsShowAtDeposit?: boolean;
  waiverRequired?: boolean;
  notifyByEmail?: boolean;
  notifyBySms?: boolean;

  depositFlatFeeCents?: number | null;
  clearDepositFlatFee?: boolean;
  maxAdvanceDays?: number | null;
  clearMaxAdvance?: boolean;
  waiverFileUrl?: string;
  clearWaiverFile?: boolean;
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

export interface PresignUploadResponse {
  url: string;
  s3Key: string;
  expiresAt: string;
}
