"use client";

// Next.js
import { useMemo, useState } from "react";

// Hooks
import { useReferenceUploads } from "@/hooks/useReferenceUploads";
import { useSlideTransition } from "@/hooks/useSlideTransition";

// Libs
import { ApiError } from "@/lib/api/client";
import { openBookApi } from "@/lib/api/openBook";
import {
  buildBookingPhases,
  buildBookingRequestPayload,
  buildInitialBookingForm,
  validateBookingPhase,
} from "@/lib/bookingFlow";
import type { OpenBookProfile } from "@/types/bookings";
import { BookingFlowPhase } from "@/types/bookingFlow";
import type { UpdateBookingForm } from "@/types/bookingFlow";

const SUBMIT_ERROR = "Couldn't submit your request. Please try again.";

export const useBookingFlow = (
  profile: OpenBookProfile,
  onOpenChange: (open: boolean) => void,
) => {
  const slug = profile.username;

  const inputPhases = useMemo(() => buildBookingPhases(profile), [profile]);
  const [phase, setPhase] = useState<BookingFlowPhase>(() => inputPhases[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(() => buildInitialBookingForm(profile));

  const uploads = useReferenceUploads(slug, setError);

  const update: UpdateBookingForm = (patch) =>
    setForm((current) => ({ ...current, ...patch }));

  const phaseIndex = inputPhases.indexOf(phase);
  const isCompleted = phase === BookingFlowPhase.Completed;
  const isFirstPhase = phaseIndex === 0;
  const isLastInputPhase = phaseIndex === inputPhases.length - 1;
  const canProceed = validateBookingPhase(
    phase,
    form,
    profile.customQuestions,
    {
      uploading: uploads.uploading,
      submitting,
    },
  );

  const slideIndex = isCompleted ? inputPhases.length : phaseIndex;
  const phaseContentRef = useSlideTransition<HTMLDivElement>(slideIndex);
  const progress = isCompleted
    ? 100
    : Math.round(((phaseIndex + 1) / inputPhases.length) * 100);

  const close = () => {
    setPhase(inputPhases[0]);
    setSubmitting(false);
    setError(null);
    setForm(buildInitialBookingForm(profile));
    uploads.reset();
    onOpenChange(false);
  };

  const goBack = () => {
    if (isFirstPhase) {
      close();
      return;
    }
    setError(null);
    setPhase(inputPhases[phaseIndex - 1]);
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const keys = uploads.references.map((reference) => reference.key);
      await openBookApi.submitRequest(
        slug,
        buildBookingRequestPayload(form, keys, profile),
      );
      setPhase(BookingFlowPhase.Completed);
      setSubmitting(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : SUBMIT_ERROR);
      setSubmitting(false);
    }
  };

  const goNext = () => {
    if (!canProceed) return;
    if (isLastInputPhase) {
      void submit();
      return;
    }
    setError(null);
    setPhase(inputPhases[phaseIndex + 1]);
  };

  return {
    profile,
    phase,
    progress,
    isCompleted,
    submitting,
    error,
    canProceed,
    isFirstPhase,
    isLastInputPhase,
    phaseContentRef,
    form,
    update,
    uploads,
    goNext,
    goBack,
    close,
  };
};
