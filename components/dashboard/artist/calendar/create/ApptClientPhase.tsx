"use client";

// Next.js
import { useState } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/CreateAppointment.module.css";

// HTML Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown } from "lucide-react";

// Components
import { OptionsSelect } from "@/components/common/OptionsSelect";

// Libs
import { formatPhone } from "@/lib/formatters";
import { BOOKING_COLOR_TYPES } from "@/constants/bookings";
import type { ManualAppointmentForm } from "@/types/calendar";

interface ApptClientPhaseProps {
  form: ManualAppointmentForm;
  update: (patch: Partial<ManualAppointmentForm>) => void;
}

export const ApptClientPhase = ({ form, update }: ApptClientPhaseProps) => {
  const [showPiece, setShowPiece] = useState(false);

  return (
    <div className={styles.phase}>
      <div className={styles.field}>
        <Label htmlFor="appt-client-name">Client name</Label>
        <Input
          id="appt-client-name"
          value={form.clientName}
          onChange={(e) => update({ clientName: e.target.value })}
          placeholder="Full name"
        />
      </div>

      <div className={styles.field}>
        <Label htmlFor="appt-client-email">Email</Label>
        <Input
          id="appt-client-email"
          type="email"
          value={form.clientEmail}
          onChange={(e) => update({ clientEmail: e.target.value })}
          placeholder="name@email.com"
        />
      </div>

      <div className={styles.field}>
        <Label htmlFor="appt-client-phone">
          Phone <span className={styles.optional}>(optional)</span>
        </Label>
        <Input
          id="appt-client-phone"
          value={form.clientPhone}
          onChange={(e) => update({ clientPhone: formatPhone(e.target.value) })}
          placeholder="+1 (555) 000-0000"
        />
      </div>

      {form.type === "session" && (
        <div className={styles.pieceSection}>
          <button
            type="button"
            className={styles.pieceToggle}
            onClick={() => setShowPiece((open) => !open)}
          >
            Piece details (optional)
            <ChevronDown
              size={16}
              className={clsx(styles.pieceChevron, {
                [styles.pieceChevronOpen]: showPiece,
              })}
            />
          </button>

          {showPiece && (
            <div className={styles.pieceFields}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <Label htmlFor="appt-placement">Placement</Label>
                  <Input
                    id="appt-placement"
                    value={form.placement}
                    onChange={(e) => update({ placement: e.target.value })}
                    placeholder="e.g. Forearm"
                  />
                </div>
                <div className={styles.field}>
                  <Label htmlFor="appt-size">Size (inches)</Label>
                  <Input
                    id="appt-size"
                    type="number"
                    min="1"
                    value={form.approxSizeInches}
                    onChange={(e) =>
                      update({ approxSizeInches: e.target.value })
                    }
                    placeholder="e.g. 6"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <Label>Color</Label>
                <OptionsSelect
                  ariaLabel="Color"
                  value={form.colorType}
                  options={BOOKING_COLOR_TYPES}
                  onValueChange={(colorType) => update({ colorType })}
                  placeholder="Select"
                />
              </div>

              <div className={styles.field}>
                <Label htmlFor="appt-notes">Notes</Label>
                <Textarea
                  id="appt-notes"
                  value={form.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="Anything worth noting about the piece"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
