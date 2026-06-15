"use client";

// CSS
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import { Switch } from "@/components/ui/switch";
import GoogleCalendarLogo from "@/public/logos/google-calendar-logo.svg";

// Components
import {
  EditableCard,
  StaticCard,
  CardRow,
  useIsEditing,
} from "./SettingsPrimitives";
import { OptionsSelect } from "@/components/common/OptionsSelect";
import { ConnectionCard } from "./ConnectionCard";
import {
  AvailabilityScheduler,
  WeeklyHoursSummary,
} from "./AvailabilityScheduler";
import { SessionTypePresets } from "./SessionTypePresets";
import { DaysOffPicker } from "./DaysOffPicker";
import { BlocklistManager } from "./BlocklistManager";

// Hooks
import { useBookingPreferencesForm } from "@/hooks/useBookingPreferencesForm";

// Libs
import { formatSelectOptions } from "@/lib/settings";
import { formatSelectValue } from "@/lib/formatters";
import { displayToast } from "@/lib/toast";
import { startGoogleCalendarFlow } from "@/lib/auth";
import {
  BUFFER_OPTIONS,
  MAX_ADVANCE_OPTIONS,
  MAX_ADVANCE_SELECT_OPTIONS,
  MIN_NOTICE_OPTIONS,
  SLOT_INTERVAL_OPTIONS,
  TIMEZONE_OPTIONS,
} from "@/constants/settings";
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";
import type { AvailabilityWindowInput } from "@/types/settings";

export const BookingPreferencesTab = ({
  controller,
}: {
  controller: ArtistSettingsController;
}) => {
  const form = useBookingPreferencesForm(controller);
  const { data } = controller;

  if (!data?.settings) return null;
  const { settings } = data;

  async function handleDisconnectCalendar(controller: ArtistSettingsController) {
    try {
      await controller.disconnectGoogleCalendar();
      displayToast("Google Calendar disconnected", "success");
    } catch {
      displayToast(
        "Couldn't disconnect Google Calendar",
        "error",
        "Please try again.",
      );
    }
  }

  return (
    <>
      <EditableCard
        title="Availability"
        description="Control whether you're taking bookings and the timezone clients see."
        onSubmit={form.submitAvailability}
        successToast="Availability updated"
        errorToast="Couldn't save availability"
        onCancel={form.availability.reset}
        disableSubmit={!form.availabilityChanged}
      >
        <CardRow
          label="Accepting bookings"
          description="Turn off to close your books (vacation mode)."
          value={settings.acceptingBookings ? "Open" : "Closed"}
        >
          <Switch
            checked={form.availability.draft.acceptingBookings}
            onCheckedChange={(acceptingBookings) =>
              form.availability.update({ acceptingBookings })
            }
          />
        </CardRow>
        <CardRow
          label="Timezone"
          description="Booking times are shown to clients in this timezone."
          value={formatSelectValue(settings.timezone, TIMEZONE_OPTIONS)}
        >
          <OptionsSelect
            ariaLabel="Timezone"
            className={styles.controlFull}
            value={form.availability.draft.timezone}
            options={TIMEZONE_OPTIONS}
            onValueChange={(timezone) => form.availability.update({ timezone })}
          />
        </CardRow>
      </EditableCard>

      <StaticCard
        title="Calendar sync"
        description="Sync your bookings with Google Calendar to avoid double-booking."
      >
        <ConnectionCard
          logo={<GoogleCalendarLogo className={styles.connectionLogoImg} />}
          title="Google Calendar"
          subtitle="Not connected — sync to block out busy times automatically."
          connected={settings.googleCalendarConnected}
          connectedDetail={
            settings.googleCalendarEmail
              ? `Synced with ${settings.googleCalendarEmail}`
              : "Calendar synced."
          }
          connectLabel="Connect Google"
          onConnect={() => {
            if (!startGoogleCalendarFlow()) {
              displayToast(
                "Google Calendar isn't available right now.",
                "error",
                "Calendar sync hasn't been configured. Please try again later.",
              );
            }
          }}
          onDisconnect={() => void handleDisconnectCalendar(controller)}
        />
      </StaticCard>

      <EditableCard
        title="Weekly hours"
        description="Set the days and hours you take bookings."
        onSubmit={form.saveWeeklySchedule}
        successToast="Weekly hours updated"
        errorToast="Couldn't save weekly hours"
        onCancel={form.resetWeeklySchedule}
        disableSubmit={!form.weeklyScheduleChanged}
      >
        <WeeklyHoursEditor
          weeklySchedule={form.weeklySchedule}
          onChange={form.setWeeklySchedule}
        />
      </EditableCard>

      <EditableCard
        title="Scheduling rules"
        onSubmit={form.submitSchedulingRules}
        successToast="Scheduling rules updated"
        errorToast="Couldn't save scheduling rules"
        onCancel={form.schedulingRules.reset}
        disableSubmit={!form.schedulingRulesChanged}
      >
        <CardRow
          label="Booking slot intervals"
          description="How granular bookable start times are."
          value={formatSelectValue(
            settings.slotIntervalMinutes,
            SLOT_INTERVAL_OPTIONS,
          )}
        >
          <OptionsSelect
            ariaLabel="Slot interval"
            className={styles.controlFull}
            value={String(form.schedulingRules.draft.slotIntervalMinutes)}
            options={formatSelectOptions(SLOT_INTERVAL_OPTIONS)}
            onValueChange={(v) =>
              form.schedulingRules.update({ slotIntervalMinutes: Number(v) })
            }
          />
        </CardRow>
        <CardRow
          label="Buffer between bookings"
          description="Padding added after each session."
          value={formatSelectValue(settings.bufferMinutes, BUFFER_OPTIONS)}
        >
          <OptionsSelect
            ariaLabel="Buffer time"
            className={styles.controlFull}
            value={String(form.schedulingRules.draft.bufferMinutes)}
            options={formatSelectOptions(BUFFER_OPTIONS)}
            onValueChange={(v) =>
              form.schedulingRules.update({ bufferMinutes: Number(v) })
            }
          />
        </CardRow>
        <CardRow
          label="Minimum notice"
          description="How far ahead clients must book."
          value={formatSelectValue(
            settings.minNoticeMinutes,
            MIN_NOTICE_OPTIONS,
          )}
        >
          <OptionsSelect
            ariaLabel="Minimum notice"
            className={styles.controlFull}
            value={String(form.schedulingRules.draft.minNoticeMinutes)}
            options={formatSelectOptions(MIN_NOTICE_OPTIONS)}
            onValueChange={(v) =>
              form.schedulingRules.update({ minNoticeMinutes: Number(v) })
            }
          />
        </CardRow>
        <CardRow
          label="Maximum advance"
          description="How far out clients can book."
          value={formatSelectValue(
            settings.maxAdvanceDays,
            MAX_ADVANCE_OPTIONS,
          )}
        >
          <OptionsSelect
            ariaLabel="Maximum advance"
            className={styles.controlFull}
            value={
              form.schedulingRules.draft.maxAdvanceDays === null
                ? "none"
                : String(form.schedulingRules.draft.maxAdvanceDays)
            }
            options={MAX_ADVANCE_SELECT_OPTIONS}
            onValueChange={(v) =>
              form.schedulingRules.update({
                maxAdvanceDays: v === "none" ? null : Number(v),
              })
            }
          />
        </CardRow>
      </EditableCard>

      <StaticCard
        title="Days off"
        description="Block specific dates so clients can't book them. Changes here save immediately."
      >
        <DaysOffPicker daysOff={data.daysOff} controller={controller} />
      </StaticCard>

      <StaticCard
        title="Blocklist"
        description="Stop specific clients from booking again. Changes here save immediately."
      >
        <BlocklistManager entries={data.blocklist} controller={controller} />
      </StaticCard>

      <StaticCard
        title="Session-type presets"
        description="Optional shortcuts to size a session quickly. Not shown to clients. Changes here save immediately."
      >
        <SessionTypePresets
          presets={data.sessionPresets}
          controller={controller}
        />
      </StaticCard>
    </>
  );
};

const WeeklyHoursEditor = ({
  weeklySchedule,
  onChange,
}: {
  weeklySchedule: AvailabilityWindowInput[];
  onChange: (windows: AvailabilityWindowInput[]) => void;
}) => {
  const isEditing = useIsEditing();
  return isEditing ? (
    <AvailabilityScheduler windows={weeklySchedule} onChange={onChange} />
  ) : (
    <WeeklyHoursSummary windows={weeklySchedule} />
  );
};
