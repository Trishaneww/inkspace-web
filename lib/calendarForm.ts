// Libs
import { combineDateTime } from "@/lib/inquiryScheduling";
import { CreateAppointmentPhase } from "@/types/calendar";
import type {
  CreateAppointmentPayload,
  ManualAppointmentForm,
} from "@/types/calendar";
import { isValidEmail } from "./validators";

export const DEFAULT_CONSULTATION_DURATION = 30;

export function buildInitialAppointmentForm(
  locationId = "",
): ManualAppointmentForm {
  return {
    type: "session",
    format: "in_person",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    locationId,
    date: null,
    timeFilter: "any",
    startMinute: null,
    endMinute: null,
    consultationDurationMinutes: DEFAULT_CONSULTATION_DURATION,
    placement: "",
    approxSizeInches: "",
    colorType: "",
    description: "",
  };
}

export function canProceedAppointmentPhase(
  phase: CreateAppointmentPhase,
  form: ManualAppointmentForm,
): boolean {
  switch (phase) {
    case CreateAppointmentPhase.Type:
      return true;
    case CreateAppointmentPhase.Client:
      return form.clientName.trim() !== "" && isValidEmail(form.clientEmail);
    case CreateAppointmentPhase.Schedule:
      if (form.date === null || form.startMinute === null) return false;
      if (form.type === "session") {
        return form.endMinute !== null && form.endMinute > form.startMinute;
      }
      return true;
    case CreateAppointmentPhase.Review:
      return true;
    default:
      return false;
  }
}

export function buildCreateAppointmentPayload(
  form: ManualAppointmentForm,
): CreateAppointmentPayload {
  const isSession = form.type === "session";
  const scheduledStart =
    form.date !== null && form.startMinute !== null
      ? combineDateTime(form.date, form.startMinute)
      : "";
  const durationMinutes =
    isSession && form.startMinute !== null && form.endMinute !== null
      ? form.endMinute - form.startMinute
      : form.consultationDurationMinutes;

  return {
    type: form.type,
    format: form.type === "consultation" ? form.format : undefined,
    clientName: form.clientName.trim(),
    clientEmail: form.clientEmail.trim(),
    clientPhone: form.clientPhone.trim(),
    scheduledStart,
    durationMinutes,
    locationId: form.locationId || undefined,
    placement: isSession ? form.placement.trim() : "",
    approxSizeInches:
      isSession && form.approxSizeInches
        ? Number(form.approxSizeInches)
        : undefined,
    colorType: isSession ? form.colorType : "",
    description: form.description.trim(),
  };
}
