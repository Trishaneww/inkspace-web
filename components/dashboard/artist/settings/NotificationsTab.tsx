"use client";

// HTML Components
import { Switch } from "@/components/ui/switch";

// Components
import { EditableCard, CardRow } from "./SettingsPrimitives";

// Hooks
import { useDraftState } from "@/hooks/useDraftState";

// Libs
import { formatOnOffLabel } from "@/lib/formatters";
import { getChangedFields, hasUnsavedChanges } from "@/lib/settings";
import type { ArtistSettings } from "@/types/settings";
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";

type Draft = Pick<ArtistSettings, "notifyByEmail" | "notifyBySms">;
const KEYS: (keyof Draft)[] = ["notifyByEmail", "notifyBySms"];

export const NotificationsTab = ({
  controller,
}: {
  controller: ArtistSettingsController;
}) => {
  const { data, saveSettings } = controller;
  const settings = data?.settings;

  const { draft, update, reset } = useDraftState<Draft>({
    notifyByEmail: settings?.notifyByEmail ?? true,
    notifyBySms: settings?.notifyBySms ?? false,
  });

  if (!settings) return null;

  return (
    <EditableCard
      title="Notifications"
      description="Choose how you want to be notified about new booking requests, deposits, and messages."
      onSubmit={() => saveSettings(getChangedFields(settings, draft, KEYS))}
      successToast="Notifications updated"
      errorToast="Couldn't save notifications"
      onCancel={reset}
      disableSubmit={!hasUnsavedChanges(settings, draft, KEYS)}
    >
      <CardRow
        label="Email notifications"
        description="Get booking and account updates by email."
        value={formatOnOffLabel(settings.notifyByEmail)}
      >
        <Switch
          checked={draft.notifyByEmail}
          onCheckedChange={(notifyByEmail) => update({ notifyByEmail })}
        />
      </CardRow>
      <CardRow
        label="SMS notifications"
        description="Get text messages for time-sensitive updates."
        value={formatOnOffLabel(settings.notifyBySms)}
      >
        <Switch
          checked={draft.notifyBySms}
          onCheckedChange={(notifyBySms) => update({ notifyBySms })}
        />
      </CardRow>
    </EditableCard>
  );
};
