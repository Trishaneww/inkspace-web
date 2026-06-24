export type SchedulingMode = "artist_scheduled" | "client_scheduled";

export enum OnboardingPhase {
  Profile,
  Studio,
  Availability,
  Styles,
  Work,
  Bookings,
  Goals,
  Calendar,
  Complete,
}

export interface OnboardingAvailabilityWindow {
  weekday: number;
  startMinute: number;
  endMinute: number;
}

export interface OnboardingPayload {
  username: string;
  instagramUrl?: string;

  studioName: string;
  studioAddress: string;
  studioCity: string;
  studioProvince: string;
  studioPostalCode: string;
  studioCountry: string;
  timezone: string;

  availability: OnboardingAvailabilityWindow[];
  styles: string[];

  depositFlatFeeCents?: number | null;
  schedulingMode: SchedulingMode;
  monthlyBookingGoal?: number;

  minSessionPriceCents?: number | null;
  declinedPlacements?: string[];
  declinedStyles?: string[];
  workSummary?: string;
}

export interface OnboardingResponse {
  onboardedAt: string;
  slug: string;
  schedulingMode: SchedulingMode;
}

export interface UsernameAvailability {
  username: string;
  available: boolean;
}

export type OnboardingFormState = {
  username: string;
  instagramHandle: string;
  studioName: string;
  studioAddress: string;
  studioCity: string;
  studioProvince: string;
  studioPostalCode: string;
  studioCountry: string;
  timezone: string;
  availability: OnboardingAvailabilityWindow[];
  styles: string[];
  deposit: string;
  schedulingMode: SchedulingMode | "";
  monthlyBookingGoal: string;
  minSessionPrice: string;
  declinedStyles: string[];
  declinedPlacements: string[];
  workSummary: string;
};

export type UsernameStatus =
  | "idle"
  | "invalid"
  | "checking"
  | "available"
  | "taken";
