"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";

// Libs
import type {
  BookingFlowFormState,
  UpdateBookingForm,
} from "@/types/bookingFlow";
import type { OpenBookLocation } from "@/types/bookings";

interface LocationPhaseProps {
  form: BookingFlowFormState;
  update: UpdateBookingForm;
  locations: OpenBookLocation[];
}

export const LocationPhase = ({
  form,
  update,
  locations,
}: LocationPhaseProps) => {
  return (
    <div className={styles.field}>
      <Label>Location</Label>
      <div className={styles.dayToggles}>
        {locations.map((location) => (
          <Button
            key={location.id}
            type="button"
            className={clsx(styles.dayToggle, {
              [styles.dayToggleActive]: form.locationId === location.id,
            })}
            onClick={() => update({ locationId: location.id })}
          >
            {location.city || location.label}
            {location.isPrimary ? " (home)" : ""}
          </Button>
        ))}
      </div>
    </div>
  );
};
