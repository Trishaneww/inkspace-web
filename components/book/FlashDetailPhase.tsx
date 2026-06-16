"use client";

// Next.js
import Image from "next/image";

// CSS
import clsx from "clsx";
import ob from "@/styles/onboarding/Onboarding.module.css";
import bk from "@/styles/book/BookingFlow.module.css";

// HTML Components
import { Label } from "@/components/ui/label";

// Libs
import { FLASH_SIZE_OPTIONS } from "@/constants/flashes";
import { PLACEMENT_OPTIONS } from "@/constants/tattooStyles";
import { formatPrice } from "@/lib/formatters";
import type {
  BookingFlowFormState,
  UpdateBookingForm,
} from "@/types/bookingFlow";
import type { OpenBookLocation } from "@/types/bookings";
import type { Flash } from "@/types/flash";
import { formatFlashPriceRange } from "@/lib/flashes";

const SIZE_LABEL = new Map(FLASH_SIZE_OPTIONS.map((size) => [size.code, size]));

interface FlashDetailPhaseProps {
  flash: Flash;
  form: BookingFlowFormState;
  update: UpdateBookingForm;
  locations: OpenBookLocation[];
}

export const FlashDetailPhase = ({
  flash,
  form,
  update,
  locations,
}: FlashDetailPhaseProps) => {
  const placements =
    flash.placements.length > 0
      ? flash.placements
      : PLACEMENT_OPTIONS.map((placement) => placement.value);
  const range = formatFlashPriceRange(flash);

  return (
    <div className={bk.flashDetail}>
      <div className={bk.flashHero}>
        {flash.image_url && (
          <Image
            src={flash.image_url}
            alt={flash.title}
            fill
            unoptimized
            className={bk.flashHeroImage}
          />
        )}
      </div>

      <div className={bk.flashSummary}>
        <h3 className={bk.flashName}>{flash.title}</h3>
        {flash.deposit_cents != null && (
          <p className={bk.flashDeposit}>
            <strong>
              {formatPrice(flash.deposit_cents, flash.currency)}
            </strong>{" "}
            deposit to claim
          </p>
        )}
        {range && (
          <p className={bk.flashPrice}>
            {range} · final price varies by size &amp; placement
          </p>
        )}
      </div>

      {locations.length > 1 && (
        <div className={ob.field}>
          <Label>Location</Label>
          <div className={ob.dayToggles}>
            {locations.map((location) => (
              <button
                key={location.id}
                type="button"
                className={clsx(
                  ob.dayToggle,
                  form.locationId === location.id && ob.dayToggleActive,
                )}
                onClick={() => update({ locationId: location.id })}
              >
                {location.city || location.label}
                {location.isPrimary ? " (home)" : ""}
              </button>
            ))}
          </div>
        </div>
      )}

      {flash.pricing_mode === "per_size" && flash.pricing_tiers.length > 0 && (
        <div className={ob.field}>
          <Label>Size</Label>
          <div className={ob.dayToggles}>
            {flash.pricing_tiers.map((tier) => (
              <button
                key={tier.size_code}
                type="button"
                className={clsx(
                  ob.dayToggle,
                  form.sizeCode === tier.size_code && ob.dayToggleActive,
                )}
                onClick={() => update({ sizeCode: tier.size_code })}
              >
                {SIZE_LABEL.get(tier.size_code)?.label ?? tier.size_code}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={ob.field}>
        <Label>Placement</Label>
        <div className={ob.dayToggles}>
          {placements.map((placement) => (
            <button
              key={placement}
              type="button"
              className={clsx(
                ob.dayToggle,
                form.placementChoice === placement && ob.dayToggleActive,
              )}
              onClick={() => update({ placementChoice: placement })}
            >
              {placement}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
