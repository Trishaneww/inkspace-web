"use client";

// Next.js
import { useState } from "react";

// CSS
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, X } from "lucide-react";

// Libs
import { format } from "date-fns";
import { formatDate } from "@/lib/formatters";
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";

interface DaysOffPickerProps {
  daysOff: string[];
  controller: ArtistSettingsController;
}

export const DaysOffPicker = ({ daysOff, controller }: DaysOffPickerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleAdd = async () => {
    if (!selectedDate) return;
    await controller.addDayOff(format(selectedDate, "yyyy-MM-dd"));
    setSelectedDate(undefined);
  };

  return (
    <div className={styles.manager}>
      <div className={styles.inlineFormRow}>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className={`${styles.controlMedium} ${styles.datePickerTrigger}`}
              >
                <CalendarIcon size={15} />
                {selectedDate
                  ? formatDate(format(selectedDate, "yyyy-MM-dd"))
                  : "Pick a date"}
              </Button>
            }
          />
          <PopoverContent className={styles.calendarPopover} align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setIsCalendarOpen(false);
              }}
              disabled={{ before: new Date() }}
            />
          </PopoverContent>
        </Popover>
        <Button variant="outline" onClick={handleAdd} disabled={!selectedDate}>
          <Plus size={15} />
          Block date
        </Button>
      </div>

      {daysOff.length === 0 ? (
        <div className={styles.emptyState}>
          No blocked dates. Add specific days clients can&apos;t book.
        </div>
      ) : (
        <div className={styles.chipGrid}>
          {daysOff.map((d) => (
            <span key={d} className={styles.chip}>
              {formatDate(d)}
              <Button
                variant="ghost"
                type="button"
                className={styles.chipRemove}
                onClick={() => controller.removeDayOff(d)}
                aria-label={`Unblock ${d}`}
              >
                <X size={12} />
              </Button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
