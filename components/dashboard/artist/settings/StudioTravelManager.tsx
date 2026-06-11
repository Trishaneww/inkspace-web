"use client";

// Next.js
import { useState } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";

// Components
import { StaticCard } from "./SettingsPrimitives";
import { OptionsSelect } from "@/components/common/OptionsSelect";

// Libs
import { format } from "date-fns";
import {
  formatDate,
  formatDateRange,
  formatLocationWithTimeRange,
  parseISODate,
} from "@/lib/formatters";
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";

export const StudioTravelManager = ({
  controller,
}: {
  controller: ArtistSettingsController;
}) => {
  const { data, addLocation, removeLocation, setCurrentLocation } = controller;
  const locations = data?.locations ?? [];
  const guestSpots = locations.filter((location) => !location.isPrimary);
  const currentId = data?.settings.currentLocationId ?? "";

  const [label, setLabel] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const canAdd =
    city.trim() !== "" &&
    country.trim() !== "" &&
    startDate !== "" &&
    endDate !== "";

  const handleAdd = async () => {
    if (!canAdd) return;
    await addLocation({
      label: label.trim(),
      address: address.trim(),
      city: city.trim(),
      province: "",
      postalCode: "",
      country: country.trim(),
      timezone: "",
      startDate,
      endDate,
    });
    setLabel("");
    setCity("");
    setCountry("");
    setAddress("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <StaticCard
      title="Travel & guest spots"
      description="Add the cities you travel to. While you're there, that's where clients book — your home studio is paused for those dates."
    >
      <div className={styles.manager}>
        {locations.length > 1 && (
          <div className={styles.field}>
            <Label>Currently working from</Label>
            <OptionsSelect
              ariaLabel="Currently working from"
              value={currentId}
              options={locations.map((location) => ({
                value: location.id,
                label: formatLocationWithTimeRange(location),
              }))}
              onValueChange={(id) => setCurrentLocation(id)}
            />
          </div>
        )}

        {guestSpots.length > 0 && (
          <div className={styles.list}>
            {guestSpots.map((spot) => (
              <div key={spot.id} className={styles.listItem}>
                <div className={styles.listItemText}>
                  <span className={styles.listItemTitle}>
                    {spot.city}
                    {spot.country ? `, ${spot.country}` : ""}
                  </span>
                  <span className={styles.listItemSubtitle}>
                    {formatDateRange(spot.startDate, spot.endDate)}
                    {spot.label ? ` · ${spot.label}` : ""}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className={styles.iconButton}
                  onClick={() => removeLocation(spot.id)}
                  aria-label={`Remove ${spot.city}`}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.inlineForm}>
          <div className={styles.inlineFormRow}>
            <div className={clsx(styles.field, styles.fieldGrow)}>
              <Label htmlFor="spot-city">City</Label>
              <Input
                id="spot-city"
                value={city}
                placeholder="e.g. Chicago"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className={clsx(styles.field, styles.fieldGrow)}>
              <Label htmlFor="spot-country">Country</Label>
              <Input
                id="spot-country"
                value={country}
                placeholder="e.g. USA"
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <Label htmlFor="spot-label">Studio name (optional)</Label>
            <Input
              id="spot-label"
              value={label}
              placeholder="e.g. Guest spot at Ink Lab"
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor="spot-address">Address (optional)</Label>
            <Input
              id="spot-address"
              value={address}
              placeholder="123 Main St"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className={styles.inlineFormRow}>
            <div className={clsx(styles.field, styles.fieldGrow)}>
              <Label>From</Label>
              <DatePopover
                value={startDate}
                onChange={setStartDate}
                disabledBefore={new Date()}
              />
            </div>
            <div className={clsx(styles.field, styles.fieldGrow)}>
              <Label>To</Label>
              <DatePopover
                value={endDate}
                onChange={setEndDate}
                disabledBefore={
                  startDate ? parseISODate(startDate) : new Date()
                }
              />
            </div>
          </div>

          <div className={styles.footerActions}>
            <Button variant="outline" onClick={handleAdd} disabled={!canAdd}>
              <Plus size={15} />
              Add guest spot
            </Button>
          </div>
        </div>
      </div>
    </StaticCard>
  );
};

const DatePopover = ({
  value,
  onChange,
  disabledBefore,
}: {
  value: string;
  onChange: (next: string) => void;
  disabledBefore?: Date;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={clsx(styles.controlFull, styles.datePickerTrigger)}
          >
            <CalendarIcon size={15} />
            {value ? formatDate(value) : "Pick a date"}
          </Button>
        }
      />
      <PopoverContent className={styles.calendarPopover} align="start">
        <Calendar
          mode="single"
          selected={value ? parseISODate(value) : undefined}
          disabled={disabledBefore ? { before: disabledBefore } : undefined}
          onSelect={(date) => {
            if (date) onChange(format(date, "yyyy-MM-dd"));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
