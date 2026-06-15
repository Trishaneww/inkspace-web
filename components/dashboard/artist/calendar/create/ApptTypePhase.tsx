"use client";

// CSS
import styles from "@/styles/dashboard/artist/CreateAppointment.module.css";

// HTML Components
import { Label } from "@/components/ui/label";

// Components
import { SegmentedChoice } from "./SegmentedChoice";

// Libs
import { APPOINTMENT_TYPE_OPTIONS } from "@/constants/calendar";
import { CONSULTATION_FORMAT_OPTIONS } from "@/constants/bookings";

// Types
import type { ManualAppointmentForm } from "@/types/calendar";
import type { AppointmentType, ConsultationFormat } from "@/types/bookings";

interface ApptTypePhaseProps {
  form: ManualAppointmentForm;
  selectType: (type: AppointmentType) => void;
  update: (patch: Partial<ManualAppointmentForm>) => void;
}

export const ApptTypePhase = ({
  form,
  selectType,
  update,
}: ApptTypePhaseProps) => (
  <div className={styles.phase}>
    <div className={styles.field}>
      <Label>Booking type</Label>
      <SegmentedChoice
        options={APPOINTMENT_TYPE_OPTIONS}
        value={form.type}
        onChange={(value) => selectType(value as AppointmentType)}
      />
    </div>

    {form.type === "consultation" && (
      <div className={styles.field}>
        <Label>Format</Label>
        <SegmentedChoice
          options={CONSULTATION_FORMAT_OPTIONS}
          value={form.format}
          onChange={(value) => update({ format: value as ConsultationFormat })}
          columns={3}
        />
      </div>
    )}
  </div>
);
