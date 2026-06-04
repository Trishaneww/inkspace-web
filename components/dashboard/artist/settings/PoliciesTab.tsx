"use client";

// Next.js
import { useRef, type ChangeEvent } from "react";

// CSS
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, X } from "lucide-react";

// Components
import { EditableCard, CardRow } from "./SettingsPrimitives";
import { getChangedFields, hasUnsavedChanges } from "@/lib/settings";

// Hooks
import { useDraftState } from "@/hooks/useDraftState";

// Libs
import { displayToast } from "@/lib/toast";
import { formatOnOffLabel } from "@/lib/formatters";
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";
import type { ArtistSettings } from "@/types/settings";

type TermsDraft = Pick<
  ArtistSettings,
  "termsText" | "termsShowOnBooking" | "termsShowAtDeposit"
>;
const TERMS_KEYS: (keyof TermsDraft)[] = [
  "termsText",
  "termsShowOnBooking",
  "termsShowAtDeposit",
];

export const PoliciesTab = ({
  controller,
}: {
  controller: ArtistSettingsController;
}) => {
  const { data, saveSettings } = controller;
  const settings = data?.settings;

  const terms = useDraftState<TermsDraft>({
    termsText: settings?.termsText ?? "",
    termsShowOnBooking: settings?.termsShowOnBooking ?? false,
    termsShowAtDeposit: settings?.termsShowAtDeposit ?? false,
  });
  const waiver = useDraftState({
    waiverRequired: settings?.waiverRequired ?? false,
  });

  if (!settings) return null;

  return (
    <>
      <EditableCard
        title="Terms & conditions"
        description="Shown to clients during booking and/or at deposit payment."
        onSubmit={() =>
          saveSettings(getChangedFields(settings, terms.draft, TERMS_KEYS))
        }
        successToast="Terms updated"
        errorToast="Couldn't save terms"
        onCancel={terms.reset}
        disableSubmit={!hasUnsavedChanges(settings, terms.draft, TERMS_KEYS)}
      >
        <CardRow label="Terms text" value={settings.termsText} stacked>
          <Textarea
            value={terms.draft.termsText}
            rows={5}
            placeholder="Your booking terms and conditions…"
            onChange={(e) => terms.update({ termsText: e.target.value })}
          />
        </CardRow>
        <CardRow
          label="Show during booking"
          value={formatOnOffLabel(settings.termsShowOnBooking)}
        >
          <Switch
            checked={terms.draft.termsShowOnBooking}
            onCheckedChange={(termsShowOnBooking) =>
              terms.update({ termsShowOnBooking })
            }
          />
        </CardRow>
        <CardRow
          label="Show at deposit payment"
          value={formatOnOffLabel(settings.termsShowAtDeposit)}
        >
          <Switch
            checked={terms.draft.termsShowAtDeposit}
            onCheckedChange={(termsShowAtDeposit) =>
              terms.update({ termsShowAtDeposit })
            }
          />
        </CardRow>
      </EditableCard>

      <EditableCard
        title="Consent / waiver"
        description="Upload a waiver clients must sign before their appointment."
        onSubmit={() =>
          saveSettings({ waiverRequired: waiver.draft.waiverRequired })
        }
        successToast="Waiver settings updated"
        errorToast="Couldn't save waiver settings"
        onCancel={waiver.reset}
        disableSubmit={waiver.draft.waiverRequired === settings.waiverRequired}
      >
        <CardRow
          label="Waiver document"
          description="PDF or image. Uploads and removals save immediately."
          alwaysOn
        >
          <WaiverUpload controller={controller} />
        </CardRow>
        <CardRow
          label="Require client signature"
          description="Clients must sign the waiver before booking is confirmed."
          value={formatOnOffLabel(settings.waiverRequired)}
        >
          <Switch
            checked={waiver.draft.waiverRequired}
            onCheckedChange={(waiverRequired) =>
              waiver.update({ waiverRequired })
            }
          />
        </CardRow>
      </EditableCard>
    </>
  );
};

const WaiverUpload = ({
  controller,
}: {
  controller: ArtistSettingsController;
}) => {
  const { data, uploadWaiver, saveSettings } = controller;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasWaiver = !!data?.settings.waiverFileUrl;

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      await uploadWaiver(file);
      displayToast("Waiver uploaded", "success");
    } catch (err) {
      displayToast(
        err instanceof Error ? err.message : "Couldn't upload waiver",
        "error",
      );
    }
  };

  const handleRemove = async () => {
    try {
      await saveSettings({ clearWaiverFile: true });
      displayToast("Waiver removed", "success");
    } catch (err) {
      displayToast(
        err instanceof Error ? err.message : "Couldn't remove waiver",
        "error",
      );
    }
  };

  return (
    <div className={styles.avatarRow}>
      {hasWaiver && (
        <a
          href={data!.settings.waiverFileUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.chip}
        >
          <FileText size={14} />
          View waiver
        </a>
      )}
      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        <Upload size={15} />
        {hasWaiver ? "Replace" : "Upload"}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        className={styles.hiddenFileInput}
        onChange={handleChange}
      />
      {hasWaiver && (
        <Button
          variant="ghost"
          className={styles.iconButton}
          onClick={handleRemove}
          aria-label="Remove waiver"
        >
          <X size={15} />
        </Button>
      )}
    </div>
  );
};
