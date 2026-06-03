import { ChangeEvent } from "react";

export type FlashStatus = "draft" | "available" | "claimed" | "archived";
export type ColorType = "black_and_grey" | "color" | "both";
export type PricingMode = "per_size" | "flat";
export type FlashSizeCode =
  | "x_small"
  | "small"
  | "medium"
  | "large"
  | "x_large";

export interface FlashPricingTier {
  size_code: FlashSizeCode;
  duration_minutes: number;
  price_cents: number;
}

export interface Flash {
  id: string;
  artist_id: string;
  status: FlashStatus;
  title: string;
  description?: string | null;
  s3_key?: string | null;
  reference_s3_key?: string | null;
  image_url?: string | null;
  reference_image_url?: string | null;
  color_type: ColorType;
  styles: string[];
  placements: string[];
  pricing_mode: PricingMode;
  flat_price_cents?: number | null;
  flat_duration_minutes?: number | null;
  deposit_cents?: number | null;
  currency: string;
  repeatable: boolean;
  claimed_at?: string | null;
  claimed_by_booking_id?: string | null;
  archived_at?: string | null;
  published_at?: string | null;
  view_count: number;
  save_count: number;
  pricing_tiers: FlashPricingTier[];
  created_at: string;
  updated_at: string;
}

export interface FlashListResponse {
  items: Flash[];
  total: number;
  available: number;
  limit: number;
  offset: number;
}

export interface CreateFlashPayload {
  title: string;
  description?: string | null;
  s3_key?: string | null;
  reference_s3_key?: string | null;
  color_type: ColorType;
  styles?: string[];
  placements?: string[];
  pricing_mode: PricingMode;
  flat_price_cents?: number | null;
  flat_duration_minutes?: number | null;
  deposit_cents?: number | null;
  currency: string;
  repeatable: boolean;
  pricing_tiers?: FlashPricingTier[];
  publish: boolean;
}

export interface UpdateFlashPayload {
  title?: string;
  description?: string | null;
  s3_key?: string | null;
  reference_s3_key?: string | null;
  // Removes the existing reference image. Distinct from reference_s3_key
  // being null/absent, which leaves the current image untouched.
  clear_reference_image?: boolean;
  color_type?: ColorType;
  styles?: string[];
  placements?: string[];
  pricing_mode?: PricingMode;
  flat_price_cents?: number | null;
  flat_duration_minutes?: number | null;
  deposit_cents?: number | null;
  currency?: string;
  repeatable?: boolean;
  pricing_tiers?: FlashPricingTier[];
}

export interface PresignUploadResponse {
  url: string;
  s3_key: string;
  expires_at: string;
}

export interface ResolvedFlashImages {
  primaryKey: string | undefined;
  referenceKey: string | undefined;
  clearReference: boolean;
}

export interface FlashImagesController {
  primaryPreviewUrl: string | null;
  referencePreviewUrl: string | null;
  hasPrimaryImage: boolean;
  handlePrimaryFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleReferenceFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRemoveReference: () => void;
  resolveForSave: (token: string) => Promise<ResolvedFlashImages>;
}

export interface FlashSizeOption {
  code: FlashSizeCode;
  label: string;
  description: string;
}

export interface TierFormRow {
  enabled: boolean;
  durationMinutes: string;
  priceDollars: string;
}

export type FlashStatusFilter = "all" | FlashStatus;
export type RepeatableFilter = "all" | "repeatable" | "non_repeatable";
export type PriceSort = "none" | "high_to_low" | "low_to_high";

export interface FilterOption<TValue extends string = string> {
  value: TValue;
  label: string;
}
