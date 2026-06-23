"use client";

// Next.js
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// Hooks
import { getApiErrorMessage } from "@/hooks/useAuthForm";
import { useGoogleCalendarConnect } from "@/hooks/useGoogleCalendarConnect";

// Libs
import { useAuth } from "@/lib/auth";
import { onboardingApi } from "@/lib/api/onboarding";
import {
  buildOnboardingPayload,
  defaultTimezone,
  USERNAME_RE,
} from "@/lib/onboarding";
import {
  DEFAULT_END_MINUTE,
  DEFAULT_MONTHLY_BOOKING_GOAL,
  DEFAULT_START_MINUTE,
  DEFAULT_WORK_DAYS,
  ONBOARDING_INPUT_PHASES,
} from "@/constants/onboarding";
import { OnboardingPhase } from "@/types/onboarding";
import type { OnboardingFormState, UsernameStatus } from "@/types/onboarding";

const USERNAME_DEBOUNCE_MS = 400;

const initialForm = (): OnboardingFormState => ({
  username: "",
  instagramHandle: "",
  studioName: "",
  studioAddress: "",
  studioCity: "",
  studioProvince: "",
  studioPostalCode: "",
  studioCountry: "",
  timezone: defaultTimezone(),
  availability: DEFAULT_WORK_DAYS.map((weekday) => ({
    weekday,
    startMinute: DEFAULT_START_MINUTE,
    endMinute: DEFAULT_END_MINUTE,
  })),
  styles: [],
  deposit: "",
  schedulingMode: "",
  monthlyBookingGoal: String(DEFAULT_MONTHLY_BOOKING_GOAL),
  minSessionPrice: "",
  declinedStyles: [],
  declinedPlacements: [],
  workSummary: "",
});

export const useOnboardingForm = () => {
  const { token, refreshUser } = useAuth();
  const router = useRouter();

  const [phase, setPhase] = useState<OnboardingPhase>(OnboardingPhase.Profile);
  const [form, setForm] = useState<OnboardingFormState>(initialForm);
  const [availability, setAvailability] = useState<{
    username: string;
    available: boolean;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const googleCalendar = useGoogleCalendarConnect();

  const update = (patch: Partial<OnboardingFormState>) =>
    setForm((f) => ({ ...f, ...patch }));

  const usernameStatus: UsernameStatus = useMemo(() => {
    const username = form.username.trim();
    if (username === "") return "idle";
    if (!USERNAME_RE.test(username)) return "invalid";
    if (availability && availability.username === username) {
      return availability.available ? "available" : "taken";
    }
    return "checking";
  }, [form.username, availability]);

  useEffect(() => {
    const username = form.username.trim();
    if (!USERNAME_RE.test(username) || !token) return;
    if (availability?.username === username) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      onboardingApi
        .checkUsername(username, token)
        .then((res) => {
          if (!cancelled) {
            setAvailability({ username, available: res.available });
          }
        })
        .catch(() => undefined);
    }, USERNAME_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [form.username, token, availability]);

  const canProceed = useMemo(() => {
    switch (phase) {
      case OnboardingPhase.Profile:
        return usernameStatus === "available";
      case OnboardingPhase.Studio:
        return (
          form.studioName.trim() !== "" &&
          form.studioAddress.trim() !== "" &&
          form.studioCity.trim() !== "" &&
          form.studioProvince.trim() !== "" &&
          form.studioPostalCode.trim() !== "" &&
          form.studioCountry.trim() !== "" &&
          form.timezone.trim() !== ""
        );
      case OnboardingPhase.Availability:
        return (
          form.availability.length > 0 &&
          form.availability.every((w) => w.endMinute > w.startMinute)
        );
      case OnboardingPhase.Styles:
        return true;
      case OnboardingPhase.Work:
        return true;
      case OnboardingPhase.Bookings:
        return form.schedulingMode !== "";
      case OnboardingPhase.Goals:
        return true;
      case OnboardingPhase.Calendar:
        return true;
      default:
        return false;
    }
  }, [phase, usernameStatus, form]);

  const phaseIndex = ONBOARDING_INPUT_PHASES.indexOf(phase);
  const isLastInputPhase = phaseIndex === ONBOARDING_INPUT_PHASES.length - 1;
  const isComplete = phase === OnboardingPhase.Complete;
  const progress = isComplete
    ? 100
    : ((phaseIndex + 1) / ONBOARDING_INPUT_PHASES.length) * 100;

  const submit = async () => {
    if (!token || form.schedulingMode === "") return;
    setSubmitting(true);
    setFormError(null);
    try {
      await onboardingApi.complete(buildOnboardingPayload(form), token);
      setPhase(OnboardingPhase.Complete);
      setSubmitting(false);
    } catch (err) {
      setFormError(
        getApiErrorMessage(err, "Could not finish setup. Please try again."),
      );
      setSubmitting(false);
    }
  };

  const onNext = async () => {
    if (!canProceed) return;
    if (isLastInputPhase) {
      await submit();
      return;
    }
    setPhase(ONBOARDING_INPUT_PHASES[phaseIndex + 1]);
  };

  const onBack = () =>
    setPhase(ONBOARDING_INPUT_PHASES[Math.max(0, phaseIndex - 1)]);

  const onDismiss = async () => {
    setSubmitting(true);
    await refreshUser();
    router.push("/dashboard/artist/bookings");
  };

  return {
    phase,
    progress,
    form,
    update,
    usernameStatus,
    canProceed,
    submitting,
    formError,
    googleCalendar,
    onNext,
    onBack,
    onDismiss,
  };
};
