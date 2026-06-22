"use client";

// CSS
import styles from "@/styles/dashboard/artist/CreateAppointment.module.css";

// HTML Components
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Components
import { OptionsSelect } from "@/components/common/OptionsSelect";
import { SegmentedChoice } from "./SegmentedChoice";
import {
  ConsultationTimeChips,
  SessionTimeRange,
  TimeOfDayFilter,
} from "@/components/dashboard/artist/scheduling/SchedulePickers";

// Libs
import { startOfDay } from "date-fns";
import { CONSULTATION_DURATION_OPTIONS } from "@/constants/calendar";
import { MIN_CHARGE_DOLLARS } from "@/constants/payments";

// Types
import type { ManualAppointmentForm } from "@/types/calendar";
import type { OpenBookAvailabilityWindow } from "@/types/bookings";
import type { Location } from "@/types/settings";

interface ApptSchedulePhaseProps {
  form: ManualAppointmentForm;
  update: (patch: Partial<ManualAppointmentForm>) => void;
  locations: Location[];
  availability: OpenBookAvailabilityWindow[];
  currency: string;
}

export const ApptSchedulePhase = ({
  form,
  update,
  locations,
  availability,
  currency,
}: ApptSchedulePhaseProps) => {
  const locationOptions = locations.map((location) => ({
    value: location.id,
    label: location.label || location.address || "Studio",
    hint: location.city || undefined,
  }));

  return (
    <div className={styles.phase}>
      {locationOptions.length > 0 && (
        <div className={styles.field}>
          <Label>Location</Label>
          <SegmentedChoice
            options={locationOptions}
            value={form.locationId}
            onChange={(locationId) => update({ locationId })}
            columns={locationOptions.length > 1 ? 2 : 1}
          />
        </div>
      )}

      <div className={styles.field}>
        <Label>Date</Label>
        <div className={styles.calendarWrap}>
          <Calendar
            mode="single"
            selected={form.date ?? undefined}
            onSelect={(date) =>
              update({ date: date ?? null, startMinute: null, endMinute: null })
            }
            disabled={{ before: startOfDay(new Date()) }}
          />
        </div>
      </div>

      {form.type === "consultation" && (
        <div className={styles.field}>
          <Label>Length</Label>
          <OptionsSelect
            ariaLabel="Length"
            value={String(form.consultationDurationMinutes)}
            options={CONSULTATION_DURATION_OPTIONS}
            onValueChange={(value) =>
              update({ consultationDurationMinutes: Number(value) })
            }
          />
        </div>
      )}

      {form.date && (
        <>
          <TimeOfDayFilter
            value={form.timeFilter}
            onChange={(timeFilter) =>
              update({ timeFilter, startMinute: null, endMinute: null })
            }
          />
          {form.type === "consultation" ? (
            <ConsultationTimeChips
              availability={availability}
              date={form.date}
              timeFilter={form.timeFilter}
              durationMinutes={form.consultationDurationMinutes}
              selected={form.startMinute}
              onSelect={(minute) => update({ startMinute: minute })}
            />
          ) : (
            <SessionTimeRange
              availability={availability}
              date={form.date}
              timeFilter={form.timeFilter}
              startMinute={form.startMinute}
              endMinute={form.endMinute}
              onChange={(patch) => update(patch)}
            />
          )}
        </>
      )}

      {form.type === "session" && (
        <div className={styles.field}>
          <div className={styles.fieldHeader}>
            <Label htmlFor="appt-deposit">Deposit ({currency})</Label>
            {form.depositAmount.trim() !== "" && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => update({ depositAmount: "" })}
              >
                No deposit
              </Button>
            )}
          </div>
          <Input
            id="appt-deposit"
            type="number"
            min={MIN_CHARGE_DOLLARS}
            step="1"
            inputMode="decimal"
            placeholder="0.00"
            value={form.depositAmount}
            onChange={(event) => update({ depositAmount: event.target.value })}
          />
          <p className={styles.fieldHint}>
            {form.depositAmount.trim() === ""
              ? "No deposit — the session is booked right away."
              : "The client pays this deposit to confirm. We hold the time for 48 hours."}
          </p>
        </div>
      )}
    </div>
  );
};
