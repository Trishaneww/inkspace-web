"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";

// Libs
import { BOOKING_PLACEMENTS, PLACEMENT_OTHER } from "@/constants/bookings";
import type {
  BookingFlowFormState,
  UpdateBookingForm,
} from "@/types/bookingFlow";

interface PlacementPhaseProps {
  form: BookingFlowFormState;
  update: UpdateBookingForm;
}

export const PlacementPhase = ({ form, update }: PlacementPhaseProps) => {
  return (
    <>
      <div className={styles.field}>
        <Label>Placement</Label>
        <div className={styles.dayToggles}>
          {BOOKING_PLACEMENTS.map((placement) => (
            <Button
              key={placement}
              type="button"
              className={clsx(styles.dayToggle, {
                [styles.dayToggleActive]: form.placementChoice === placement,
              })}
              onClick={() => update({ placementChoice: placement })}
            >
              {placement}
            </Button>
          ))}
        </div>
        {form.placementChoice === PLACEMENT_OTHER && (
          <Input
            value={form.placementOther}
            placeholder="Where on the body?"
            onChange={(e) => update({ placementOther: e.target.value })}
          />
        )}
      </div>

      <div className={styles.field}>
        <Label htmlFor="ob-size">Approx. size in inches</Label>
        <Input
          id="ob-size"
          type="number"
          min={1}
          value={form.approxSize}
          placeholder="4"
          onChange={(e) => update({ approxSize: e.target.value })}
        />
      </div>
    </>
  );
};
