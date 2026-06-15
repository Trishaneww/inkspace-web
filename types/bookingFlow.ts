// Libs
import type { ChangeEvent, RefObject } from "react";
import type { OpenBookAvailabilityWindow } from "@/types/bookings";

export enum BookingFlowPhase {
  BookingTrack,
  Location,
  Tattoo,
  Placement,
  Style,
  CustomQuestions,
  Availability,
  FlashGrid,
  FlashDetail,
  Contact,
  Completed,
}

export type BookingFlowEntry = "book" | "flash";
export type BookingFlowTrack = "choose" | "custom" | "flash";

export interface BookingFlowFormState {
  locationId: string;
  flashId: string;
  sizeCode: string;
  description: string;
  placementChoice: string;
  placementOther: string;
  approxSize: string;
  colorType: string;
  selectedStyles: string[];
  answers: Record<string, string>;
  windows: OpenBookAvailabilityWindow[];
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}

export type UpdateBookingForm = (patch: Partial<BookingFlowFormState>) => void;

export interface ReferenceImage {
  key: string;
  previewUrl: string;
}

export interface ReferenceUploadsController {
  references: ReferenceImage[];
  uploading: boolean;
  canAddMore: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleFiles: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeReference: (key: string) => void;
  reset: () => void;
}
