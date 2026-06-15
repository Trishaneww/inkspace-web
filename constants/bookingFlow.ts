// Libs
import { BookingFlowPhase } from "@/types/bookingFlow";

export const MAX_REFERENCES = 3;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const BOOKING_FLOW_PHASE_META: Record<
  BookingFlowPhase,
  { lead: string; rest: string }
> = {
  [BookingFlowPhase.BookingTrack]: {
    lead: "What are you after?",
    rest: "A custom piece, or one of the artist's flash designs.",
  },
  [BookingFlowPhase.Location]: {
    lead: "Where?",
    rest: "Which location would you like to book?",
  },
  [BookingFlowPhase.Tattoo]: {
    lead: "Your tattoo.",
    rest: "Tell us what you're thinking.",
  },
  [BookingFlowPhase.Placement]: {
    lead: "The placement.",
    rest: "Where on the body, and how big?",
  },
  [BookingFlowPhase.Style]: {
    lead: "The style.",
    rest: "Black & grey or color — and any styles you like.",
  },
  [BookingFlowPhase.CustomQuestions]: {
    lead: "A few questions.",
    rest: "The artist would like to know a little more.",
  },
  [BookingFlowPhase.Availability]: {
    lead: "Your availability.",
    rest: "Pick the days and times that work for you.",
  },
  [BookingFlowPhase.FlashGrid]: {
    lead: "The flashbook.",
    rest: "Pick a design to claim.",
  },
  [BookingFlowPhase.FlashDetail]: {
    lead: "Claim this flash.",
    rest: "Choose your size, placement, and location.",
  },
  [BookingFlowPhase.Contact]: {
    lead: "Your contact.",
    rest: "Where the artist can reach you.",
  },
  [BookingFlowPhase.Completed]: {
    lead: "Request sent.",
    rest: "The artist will reach out by email with next steps.",
  },
};
