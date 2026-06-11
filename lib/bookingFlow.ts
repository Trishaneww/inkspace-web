// Libs
import { PLACEMENT_OTHER } from "@/constants/bookings";
import { WEEKDAYS } from "@/constants/settings";
import { BookingFlowPhaseKind } from "@/types/bookingFlow";
import type {
  BookingFlowFormState,
  BookingFlowPhase,
} from "@/types/bookingFlow";
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

export function initialBookingForm(
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
 * shows with more than one location, one step per custom question, and the
 * availability step only when the artist publishes any hours.
 */
export function buildBookingPhases(
  profile: OpenBookProfile,
): BookingFlowPhase[] {
  const phases: BookingFlowPhase[] = [];

  if (profile.locations.length > 1) {
    phases.push({ kind: BookingFlowPhaseKind.Location });
  }
  phases.push({ kind: BookingFlowPhaseKind.Tattoo });
  phases.push({ kind: BookingFlowPhaseKind.Placement });
  phases.push({ kind: BookingFlowPhaseKind.Style });

  profile.customQuestions.forEach((question, questionIndex) => {
    phases.push({
      kind: BookingFlowPhaseKind.CustomQuestion,
      question,
      questionIndex,
    });
  });

  if (availableWeekdays(profile.availability).length > 0) {
    phases.push({ kind: BookingFlowPhaseKind.Availability });
  }
  phases.push({ kind: BookingFlowPhaseKind.Contact });

  return phases;
}

/** Whether the client may advance past the given phase. */
export function validateBookingPhase(
  phase: BookingFlowPhase,
  form: BookingFlowFormState,
  flags: ValidationFlags,
): boolean {
  switch (phase.kind) {
    case BookingFlowPhaseKind.Location:
      return form.locationId !== "";
    case BookingFlowPhaseKind.Tattoo:
      return form.description.trim() !== "" && !flags.uploading;
    case BookingFlowPhaseKind.Placement:
      return (
        form.placementChoice !== "" &&
        (form.placementChoice !== PLACEMENT_OTHER ||
          form.placementOther.trim() !== "")
      );
    case BookingFlowPhaseKind.Style:
      return form.colorType !== "";
    case BookingFlowPhaseKind.Contact:
      return (
        form.clientName.trim() !== "" &&
        form.clientEmail.trim() !== "" &&
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

export function buildBookingRequestPayload(
  form: BookingFlowFormState,
  referenceImageKeys: string[],
  profile: OpenBookProfile,
): CreateBookingRequestPayload {
  const size = Number(form.approxSize);
  const hasSize =
    form.approxSize.trim() !== "" && Number.isFinite(size) && size > 0;

  return {
    locationId: form.locationId,
    description: form.description.trim(),
    referenceImageKeys,
    placement: resolvePlacement(form),
    approxSizeInches: hasSize ? Math.round(size) : undefined,
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
