"use client";

// Next.js
import { useState } from "react";

// Hooks
import { getApiErrorMessage } from "@/hooks/useAuthForm";

// Libs
import { useAuth } from "@/lib/auth";
import { calendarApi } from "@/lib/api/calendar";
import { displayToast } from "@/lib/toast";
import {
  buildCreateAppointmentPayload,
  canProceedAppointmentPhase,
  buildInitialAppointmentForm,
} from "@/lib/calendarForm";
import { CREATE_APPOINTMENT_PHASES } from "@/constants/calendar";
import { CreateAppointmentPhase } from "@/types/calendar";

// Types
import type { ManualAppointmentForm } from "@/types/calendar";
import type { AppointmentType } from "@/types/bookings";

export const useCreateAppointment = (
  onCreated: () => void,
  defaultLocationId = "",
  defaultDepositCents: number | null = null,
) => {
  const { token } = useAuth();

  const [phase, setPhase] = useState<CreateAppointmentPhase>(
    CreateAppointmentPhase.Type,
  );
  const [form, setForm] = useState<ManualAppointmentForm>(() =>
    buildInitialAppointmentForm(defaultLocationId, defaultDepositCents),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<ManualAppointmentForm>) =>
    setForm((f) => ({ ...f, ...patch }));

  const selectType = (type: AppointmentType) =>
    update({ type, startMinute: null, endMinute: null });

  const phaseIndex = CREATE_APPOINTMENT_PHASES.indexOf(phase);
  const isLastPhase = phaseIndex === CREATE_APPOINTMENT_PHASES.length - 1;
  const canProceed = canProceedAppointmentPhase(phase, form);

  const submit = async () => {
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      await calendarApi.create(token, buildCreateAppointmentPayload(form));
      displayToast("Booking created", "success");
      onCreated();
    } catch (err) {
      setError(getApiErrorMessage(err, "Couldn't create the booking."));
      setSubmitting(false);
    }
  };

  const next = async () => {
    if (!canProceed) return;
    if (isLastPhase) {
      await submit();
      return;
    }
    setPhase(CREATE_APPOINTMENT_PHASES[phaseIndex + 1]);
  };

  const back = () =>
    setPhase(CREATE_APPOINTMENT_PHASES[Math.max(0, phaseIndex - 1)]);

  return {
    phase,
    phaseIndex,
    form,
    update,
    selectType,
    canProceed,
    isLastPhase,
    submitting,
    error,
    next,
    back,
  };
};
