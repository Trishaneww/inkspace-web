// Libs
import { TIMEZONE_OPTIONS } from "@/constants/settings";
import type {
  OnboardingFormState,
  OnboardingPayload,
  SchedulingMode,
} from "@/types/onboarding";

export const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/;

export function defaultTimezone(): string {
  const detected = detectTimezone();
  return TIMEZONE_OPTIONS.some((tz) => tz.value === detected) ? detected : "";
}

function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

const INSTAGRAM_BASE_URL = "https://www.instagram.com/";

export function buildOnboardingPayload(
  form: OnboardingFormState,
): OnboardingPayload {
  const handle = form.instagramHandle.trim().replace(/^@+/, "");
  return {
    username: form.username.trim(),
    instagramUrl: handle ? `${INSTAGRAM_BASE_URL}${handle}` : undefined,
    studioName: form.studioName.trim(),
    studioAddress: form.studioAddress.trim(),
    studioCity: form.studioCity.trim(),
    studioProvince: form.studioProvince.trim(),
    studioPostalCode: form.studioPostalCode.trim(),
    studioCountry: form.studioCountry.trim(),
    timezone: form.timezone.trim(),
    availability: form.availability,
    depositFlatFeeCents: form.deposit
      ? Math.round(parseFloat(form.deposit) * 100)
      : null,
    schedulingMode: form.schedulingMode as SchedulingMode,
  };
}
