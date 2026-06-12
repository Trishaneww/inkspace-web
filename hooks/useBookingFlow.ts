"use client";

// Next.js
import { useEffect, useMemo, useRef, useState } from "react";

// Hooks
import { useReferenceUploads } from "@/hooks/useReferenceUploads";
import { useSlideTransition } from "@/hooks/useSlideTransition";

// Libs
import { ApiError } from "@/lib/api/client";
import { openBookApi } from "@/lib/api/openBook";
import { flashesApi } from "@/lib/api/flashes";
import {
  buildBookingPhases,
  buildBookingRequestPayload,
  buildFlashRequestPayload,
  buildInitialBookingForm,
  validateBookingPhase,
  validateFlashDetail,
} from "@/lib/bookingFlow";
import type { OpenBookProfile } from "@/types/bookings";
import { BookingFlowPhase } from "@/types/bookingFlow";
import type {
  BookingFlowEntry,
  BookingFlowTrack,
  UpdateBookingForm,
} from "@/types/bookingFlow";
import type { Flash } from "@/types/flash";

const SUBMIT_ERROR = "Couldn't submit your request. Please try again.";
const FLASHES_ERROR = "Couldn't load the flashbook. Please try again.";

export const useBookingFlow = (
  profile: OpenBookProfile,
  entry: BookingFlowEntry,
  onOpenChange: (open: boolean) => void,
) => {
  const slug = profile.username;
  const includesFlashChoice = entry === "book" && profile.hasFlashes;

  const [track, setTrack] = useState<BookingFlowTrack>(() =>
    resolveInitialTrack(entry, profile.hasFlashes),
  );
  const inputPhases = useMemo(
    () => buildBookingPhases(profile, track, includesFlashChoice),
    [profile, track, includesFlashChoice],
  );
  const [phase, setPhase] = useState<BookingFlowPhase>(() => inputPhases[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(() => buildInitialBookingForm(profile));

  const uploads = useReferenceUploads(slug, setError);

  // The flashbook loads lazily the first time the flash track is active.
  const [flashes, setFlashes] = useState<Flash[]>([]);
  const [flashesLoading, setFlashesLoading] = useState(false);
  const [flashesError, setFlashesError] = useState<string | null>(null);
  const flashesRequested = useRef(false);

  useEffect(() => {
    if (track !== "flash" || flashesRequested.current) return;
    flashesRequested.current = true;
    setFlashesLoading(true);
    flashesApi
      .listByArtist(profile.artistId, { status: "available" })
      .then((result) => setFlashes(result.items))
      .catch(() => setFlashesError(FLASHES_ERROR))
      .finally(() => setFlashesLoading(false));
  }, [track, profile.artistId]);

  const selectedFlash = useMemo(
    () => flashes.find((flash) => flash.id === form.flashId) ?? null,
    [flashes, form.flashId],
  );

  const update: UpdateBookingForm = (patch) =>
    setForm((current) => ({ ...current, ...patch }));

  const phaseIndex = inputPhases.indexOf(phase);
  const isCompleted = phase === BookingFlowPhase.Completed;
  const isFirstPhase = phaseIndex === 0;
  const isLastInputPhase = phaseIndex === inputPhases.length - 1;

  const canProceed = useMemo(() => {
    switch (phase) {
      case BookingFlowPhase.BookingTrack:
        return track === "custom" || track === "flash";
      case BookingFlowPhase.FlashGrid:
        return form.flashId !== "";
      case BookingFlowPhase.FlashDetail:
        return validateFlashDetail(selectedFlash, form);
      default:
        return validateBookingPhase(phase, form, profile.customQuestions, {
          uploading: uploads.uploading,
          submitting,
        });
    }
  }, [
    phase,
    track,
    form,
    selectedFlash,
    profile.customQuestions,
    uploads.uploading,
    submitting,
  ]);

  // Only the custom track shows a progress bar — not the flash track or the
  // custom-vs-flash choice step.
  const showProgress =
    track === "custom" && phase !== BookingFlowPhase.BookingTrack;
  const slideIndex = isCompleted ? inputPhases.length : phaseIndex;
  const phaseContentRef = useSlideTransition<HTMLDivElement>(slideIndex);
  const progress = isCompleted
    ? 100
    : Math.round(((phaseIndex + 1) / inputPhases.length) * 100);

  const primaryLabel = useMemo(() => {
    if (phase === BookingFlowPhase.FlashGrid) return null;
    if (phase === BookingFlowPhase.FlashDetail) return "Book this flash";
    if (phase === BookingFlowPhase.BookingTrack) return "Continue";
    return isLastInputPhase ? "Send request" : "Continue";
  }, [phase, isLastInputPhase]);

  const close = () => onOpenChange(false);

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
      const payload =
        track === "flash"
          ? buildFlashRequestPayload(form)
          : buildBookingRequestPayload(
              form,
              uploads.references.map((reference) => reference.key),
              profile,
            );
      await openBookApi.submitRequest(slug, payload);
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

  const selectFlash = (flashId: string) => {
    setError(null);
    setForm((current) => ({
      ...current,
      flashId,
      sizeCode: "",
      placementChoice: "",
    }));
    const detailIndex = inputPhases.indexOf(BookingFlowPhase.FlashGrid) + 1;
    setPhase(inputPhases[detailIndex]);
  };

  const selectTrack = (next: BookingFlowTrack) => {
    setError(null);
    setTrack(next);
  };

  return {
    profile,
    phase,
    track,
    showProgress,
    progress,
    isCompleted,
    submitting,
    error,
    canProceed,
    isFirstPhase,
    primaryLabel,
    phaseContentRef,
    form,
    update,
    uploads,
    flashes,
    flashesLoading,
    flashesError,
    selectedFlash,
    selectFlash,
    selectTrack,
    goNext,
    goBack,
    close,
  };
};

const resolveInitialTrack = (
  entry: BookingFlowEntry,
  hasFlashes: boolean,
): BookingFlowTrack => {
  if (entry === "flash") return "flash";
  return hasFlashes ? "choose" : "custom";
};
