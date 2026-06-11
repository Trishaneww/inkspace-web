"use client";

// CSS
import clsx from "clsx";
import ob from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Label } from "@/components/ui/label";

// Libs
import { BOOKING_COLOR_TYPES } from "@/constants/bookings";
import { TATTOO_STYLE_LABELS } from "@/constants/tattooStyles";
import type {
  BookingFlowFormState,
  UpdateBookingForm,
} from "@/types/bookingFlow";

interface StylePhaseProps {
  form: BookingFlowFormState;
  update: UpdateBookingForm;
  styles: string[];
}

export const StylePhase = ({ form, update, styles }: StylePhaseProps) => {
  const toggleStyle = (style: string) =>
    update({
      selectedStyles: form.selectedStyles.includes(style)
        ? form.selectedStyles.filter((item) => item !== style)
        : [...form.selectedStyles, style],
    });

  return (
    <>
      <div className={ob.field}>
        <Label>Black & grey or color?</Label>
        <div className={ob.dayToggles}>
          {BOOKING_COLOR_TYPES.map((option) => (
            <button
              key={option.value}
              type="button"
              className={clsx(
                ob.dayToggle,
                form.colorType === option.value && ob.dayToggleActive,
              )}
              onClick={() => update({ colorType: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {styles.length > 0 && (
        <div className={ob.field}>
          <Label>Styles (optional)</Label>
          <div className={ob.dayToggles}>
            {styles.map((style) => (
              <button
                key={style}
                type="button"
                className={clsx(
                  ob.dayToggle,
                  form.selectedStyles.includes(style) && ob.dayToggleActive,
                )}
                onClick={() => toggleStyle(style)}
              >
                {TATTOO_STYLE_LABELS[style] ?? style}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
