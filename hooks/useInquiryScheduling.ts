"use client";

// Next.js
import { useState } from "react";

// Libs
import { bookingsApi } from "@/lib/api/bookings";
import { useAuth } from "@/lib/auth";
import { displayToast } from "@/lib/toast";
import {
  buildAcceptPayload,
  buildConsultationPayload,
  buildReschedulePayload,
  canSubmitSchedule,
  createRescheduleForm,
  createSchedulingForm,
} from "@/lib/inquiryScheduling";
import type {
  Appointment,
  AppointmentType,
  Inquiry,
  InquirySchedulingForm,
} from "@/types/bookings";

export type SchedulePhase = "length" | "schedule" | "review";

export function useInquiryScheduling(
  inquiry: Inquiry,
  onScheduled: (updated: Inquiry) => void,
) {
  const { token } = useAuth();
  const [appointmentType, setAppointmentType] =
    useState<AppointmentType | null>(null);
  const [isReschedule, setIsReschedule] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] =
    useState<Appointment | null>(null);
  const [phase, setPhase] = useState<SchedulePhase>("schedule");
  const [form, setForm] = useState<InquirySchedulingForm>(() =>
    createSchedulingForm(inquiry),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<InquirySchedulingForm>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const openSchedule = (type: AppointmentType) => {
    setForm(createSchedulingForm(inquiry));
    setError(null);
    setIsReschedule(false);
    setPhase(getStartingPhase(type));
    setAppointmentType(type);
  };

  const openReschedule = (appointment: Appointment) => {
    setRescheduleAppointment(appointment);
    setForm(createRescheduleForm(inquiry, appointment));
    setError(null);
    setIsReschedule(true);
    setPhase(getStartingPhase(appointment.type));
    setAppointmentType(appointment.type);
  };

  const close = () => {
    setAppointmentType(null);
    setIsReschedule(false);
    setRescheduleAppointment(null);
    setPhase("schedule");
    setError(null);
  };

  const selectLength = (minutes: number) => {
    update({ consultationDurationMinutes: minutes });
    setPhase("schedule");
  };

  const canSubmit = appointmentType
    ? canSubmitSchedule(inquiry, appointmentType, form, isReschedule)
    : false;

  const goToReview = () => {
    if (canSubmit) setPhase("review");
  };

  const back = () => {
    setError(null);
    if (phase === "review") {
      setPhase("schedule");
    } else if (phase === "schedule" && appointmentType === "consultation") {
      setPhase("length");
    } else {
      close();
    }
  };

  const primaryLabel = isReschedule
    ? "Save new time"
    : appointmentType === "consultation"
      ? "Request consultation"
      : "Create booking";

  const submit = async () => {
    if (!token || !appointmentType || !canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated =
        isReschedule && rescheduleAppointment
          ? await bookingsApi.reschedule(
              token,
              inquiry.id,
              buildReschedulePayload(rescheduleAppointment, form),
            )
        : appointmentType === "consultation"
          ? await bookingsApi.requestConsultation(
              token,
              inquiry.id,
              buildConsultationPayload(inquiry, form),
            )
          : await bookingsApi.accept(
              token,
              inquiry.id,
              buildAcceptPayload(inquiry, form),
            );
      displayToast(
        isReschedule
          ? "Booking rescheduled"
          : appointmentType === "consultation"
            ? "Consultation requested"
            : "Booking accepted",
        "success",
      );
      onScheduled(updated);
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't schedule");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    appointmentType,
    isReschedule,
    phase,
    form,
    update,
    openSchedule,
    openReschedule,
    selectLength,
    goToReview,
    back,
    submit,
    submitting,
    canSubmit,
    primaryLabel,
    error,
  };
}

function getStartingPhase(type: AppointmentType): SchedulePhase {
  return type === "consultation" ? "length" : "schedule";
}
