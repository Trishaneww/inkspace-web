// Libs
import { isPhoneComplete } from "@/lib/formatters";
import { PLACEMENT_OTHER } from "@/constants/bookings";
import { WEEKDAYS } from "@/constants/settings";
import { BookingFlowPhase } from "@/types/bookingFlow";
import type { BookingFlowFormState } from "@/types/bookingFlow";
import type {
  CreateBookingRequestPayload,
  OpenBookAvailabilityWindow,
  OpenBookProfile,
} from "@/types/bookings";

export interface DayBound {
  start: number;
  end: number;
}

interface ValidationFlags {
  uploading: boolean;
  submitting: boolean;
}

/**
 * Picks the location to preselect: the spot the artist is currently working
 * from, else their home studio, else the first one (empty when they have none).
 */
export function resolveDefaultLocationId(profile: OpenBookProfile): string {
  return (
    profile.locations.find((location) => location.isCurrent)?.id ??
    profile.locations.find((location) => location.isPrimary)?.id ??
    profile.locations[0]?.id ??
    ""
  );
}

export function buildInitialBookingForm(
  profile: OpenBookProfile,
): BookingFlowFormState {
  return {
    locationId: resolveDefaultLocationId(profile),
    description: "",
    placementChoice: "",
    placementOther: "",
    approxSize: "",
    colorType: "",
    selectedStyles: [],
    answers: {},
    windows: [],
    clientName: "",
    clientEmail: "",
    clientPhone: "",
  };
}

/**
 * Collapses an artist's availability windows into one overall {start, end}
 * bound per weekday, so the client can only propose times inside the hours the
 * artist actually works.
 */
export function collapseAvailabilityBounds(
  availability: OpenBookAvailabilityWindow[],
): Map<number, DayBound> {
  const bounds = new Map<number, DayBound>();
  for (const window of availability) {
    const existing = bounds.get(window.weekday);
    if (existing) {
      existing.start = Math.min(existing.start, window.startMinute);
      existing.end = Math.max(existing.end, window.endMinute);
    } else {
      bounds.set(window.weekday, {
        start: window.startMinute,
        end: window.endMinute,
      });
    }
  }
  return bounds;
}

export function availableWeekdays(availability: OpenBookAvailabilityWindow[]) {
  const bounds = collapseAvailabilityBounds(availability);
  return WEEKDAYS.filter((day) => bounds.has(day.value));
}

/**
 * Builds the ordered list of phases for this artist: the location step only
 * shows with more than one location, the custom-questions step only when the
 * artist has any, and the availability step only when they publish any hours.
 */
export function buildBookingPhases(
  profile: OpenBookProfile,
): BookingFlowPhase[] {
  const phases: BookingFlowPhase[] = [];

  if (profile.locations.length > 1) {
    phases.push(BookingFlowPhase.Location);
  }
  phases.push(
    BookingFlowPhase.Tattoo,
    BookingFlowPhase.Placement,
    BookingFlowPhase.Style,
  );
  if (profile.customQuestions.length > 0) {
    phases.push(BookingFlowPhase.CustomQuestions);
  }
  if (availableWeekdays(profile.availability).length > 0) {
    phases.push(BookingFlowPhase.Availability);
  }
  phases.push(BookingFlowPhase.Contact);

  return phases;
}

/** Whether the client may advance past the given phase. */
export function validateBookingPhase(
  phase: BookingFlowPhase,
  form: BookingFlowFormState,
  customQuestions: string[],
  flags: ValidationFlags,
): boolean {
  switch (phase) {
    case BookingFlowPhase.Location:
      return form.locationId !== "";
    case BookingFlowPhase.Tattoo:
      return form.description.trim() !== "" && !flags.uploading;
    case BookingFlowPhase.Placement:
      return (
        form.placementChoice !== "" &&
        (form.placementChoice !== PLACEMENT_OTHER ||
          form.placementOther.trim() !== "") &&
        parseApproxSizeInches(form.approxSize) !== undefined
      );
    case BookingFlowPhase.Style:
      return form.colorType !== "";
    case BookingFlowPhase.CustomQuestions:
      return customQuestions.every(
        (question) => (form.answers[question] ?? "").trim() !== "",
      );
    case BookingFlowPhase.Contact:
      return (
        form.clientName.trim() !== "" &&
        form.clientEmail.trim() !== "" &&
        isPhoneComplete(form.clientPhone) &&
        !flags.submitting
      );
    default:
      return true;
  }
}

export function resolvePlacement(form: BookingFlowFormState): string {
  return form.placementChoice === PLACEMENT_OTHER
    ? form.placementOther.trim()
    : form.placementChoice;
}

/** The whole-inch size, or undefined when the field is empty or not a positive number. */
export function parseApproxSizeInches(approxSize: string): number | undefined {
  const size = Number(approxSize);
  return approxSize.trim() !== "" && Number.isFinite(size) && size > 0
    ? Math.round(size)
    : undefined;
}

export function buildBookingRequestPayload(
  form: BookingFlowFormState,
  referenceImageKeys: string[],
  profile: OpenBookProfile,
): CreateBookingRequestPayload {
  return {
    locationId: form.locationId,
    description: form.description.trim(),
    referenceImageKeys,
    placement: resolvePlacement(form),
    approxSizeInches: parseApproxSizeInches(form.approxSize),
    colorType: form.colorType,
    styles: form.selectedStyles,
    customAnswers: profile.customQuestions
      .map((question) => ({
        prompt: question,
        answer: (form.answers[question] ?? "").trim(),
      }))
      .filter((entry) => entry.answer !== ""),
    clientAvailability: form.windows,
    clientName: form.clientName.trim(),
    clientEmail: form.clientEmail.trim(),
    clientPhone: form.clientPhone.trim(),
  };
}
