// Libs
import { CalendarCheck, CalendarClock, type LucideIcon } from "lucide-react";
import { OnboardingPhase, type SchedulingMode } from "@/types/onboarding";

export const WEEKDAYS = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
];

export const DEFAULT_WORK_DAYS = [1, 2, 3, 4, 5];
export const DEFAULT_START_MINUTE = 600;
export const DEFAULT_END_MINUTE = 1080;

export const SCHEDULING_OPTIONS: {
  value: SchedulingMode;
  label: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: "artist_scheduled",
    label: "Manual Scheduling",
    description:
      "When a client sends an inquiry, you place them directly into a time slot.",
    icon: CalendarClock,
  },
  {
    value: "client_scheduled",
    label: "Self-Scheduling",
    description:
      "You accept the inquiry and set a session length; the client books their own start time within it.",
    icon: CalendarCheck,
  },
];

export const ONBOARDING_INPUT_PHASES = [
  OnboardingPhase.Profile,
  OnboardingPhase.Studio,
  OnboardingPhase.Availability,
  OnboardingPhase.Styles,
  OnboardingPhase.Bookings,
];

export const ONBOARDING_PHASE_META: Record<
  OnboardingPhase,
  { lead: string; rest: string }
> = {
  [OnboardingPhase.Profile]: {
    lead: "Your profile.",
    rest: "How clients will find and recognize you.",
  },
  [OnboardingPhase.Studio]: {
    lead: "Where you tattoo.",
    rest: "Your studio location, shown on your booking page.",
  },
  [OnboardingPhase.Availability]: {
    lead: "Your hours.",
    rest: "Roughly when you take clients — you can fine-tune this later.",
  },
  [OnboardingPhase.Styles]: {
    lead: "Your styles.",
    rest: "What you specialize in — clients pick from these for custom work.",
  },
  [OnboardingPhase.Bookings]: {
    lead: "Bookings.",
    rest: "Choose how clients book with you.",
  },
  [OnboardingPhase.Complete]: {
    lead: "You're all set.",
    rest: "Your Open Book is live and you're ready to start taking clients.",
  },
};

export const COMPLETION_BULLETS = [
  {
    title: "Your booking link is live",
    description:
      "Share your Open Book link in your bio — clients can send booking requests right away.",
  },
  {
    title: "Take payments & deposits",
    description:
      "Send deposit requests and accept payments so a spot is only held once a client commits.",
  },
  {
    title: "Run everything from one place",
    description:
      "Review inquiries, schedule sessions, and keep your calendar full from your dashboard.",
  },
];
