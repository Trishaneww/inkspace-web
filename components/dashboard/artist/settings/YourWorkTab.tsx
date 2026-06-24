"use client";

// Next.js
import { useState } from "react";

// HTML Components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Components
import { EditableCard, CardRow } from "./SettingsPrimitives";
import { TattooStylesPicker } from "@/components/common/TattooStylesPicker";
import { ChipMultiSelect } from "@/components/common/ChipMultiSelect";

// Hooks
import { useDraftState } from "@/hooks/useDraftState";

// Libs
import { PLACEMENT_CHIP_OPTIONS } from "@/constants/settings";
import { TATTOO_STYLE_LABELS } from "@/constants/tattooStyles";
import { convertDollarsToCents } from "@/lib/flashes";
import { formatCentsAsInput, formatCurrency, formatPrice } from "@/lib/formatters";

// Types
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";
import type { ArtistSettings, UpdateSettingsPayload } from "@/types/settings";

type WorkDraft = Pick<
  ArtistSettings,
  "declinedStyles" | "declinedPlacements" | "workSummary"
>;

const sameSet = (a: string[], b: string[]) =>
  JSON.stringify(a) === JSON.stringify(b);

export const YourWorkTab = ({
  controller,
}: {
  controller: ArtistSettingsController;
}) => {
  const { data, saveSettings } = controller;
  const settings = data?.settings;

  const [priceInput, setPriceInput] = useState(
    formatCentsAsInput(settings?.minSessionPriceCents ?? null),
  );
  const { draft, update, reset } = useDraftState<WorkDraft>({
    declinedStyles: settings?.declinedStyles ?? [],
    declinedPlacements: settings?.declinedPlacements ?? [],
    workSummary: settings?.workSummary ?? "",
  });

  if (!settings) return null;

  const currency = settings.currency || "CAD";
  const parsedPrice = convertDollarsToCents(priceInput);
  const priceChanged = parsedPrice !== settings.minSessionPriceCents;
  const stylesChanged = !sameSet(draft.declinedStyles, settings.declinedStyles);
  const placementsChanged = !sameSet(
    draft.declinedPlacements,
    settings.declinedPlacements,
  );
  const summaryChanged = draft.workSummary.trim() !== settings.workSummary;

  const hasChanges =
    priceChanged || stylesChanged || placementsChanged || summaryChanged;

  const resetAll = () => {
    setPriceInput(formatCentsAsInput(settings.minSessionPriceCents));
    reset();
  };

  const handleSubmit = async () => {
    const patch: UpdateSettingsPayload = {};
    if (priceChanged) {
      if (parsedPrice == null) patch.clearMinSessionPrice = true;
      else patch.minSessionPriceCents = parsedPrice;
    }
    if (stylesChanged) patch.declinedStyles = draft.declinedStyles;
    if (placementsChanged) patch.declinedPlacements = draft.declinedPlacements;
    if (summaryChanged) patch.workSummary = draft.workSummary.trim();
    await saveSettings(patch);
  };

  const priceValue =
    settings.minSessionPriceCents != null
      ? formatPrice(settings.minSessionPriceCents, currency)
      : "";
  const styleLabels = settings.declinedStyles
    .map((s) => TATTOO_STYLE_LABELS[s] ?? s)
    .join(", ");

  return (
    <EditableCard
      title="Your work"
      description="Helps Inkspace's AI assistant review new requests accurately. All optional — and never shown to clients."
      onSubmit={handleSubmit}
      successToast="Saved"
      errorToast="Couldn't save"
      onCancel={resetAll}
      disableSubmit={!hasChanges}
    >
      <CardRow
        label="Minimum session price"
        description="Your floor for a session. Used to flag budget fit on new requests."
        value={priceValue}
      >
        <Input
          value={priceInput}
          inputMode="decimal"
          placeholder={`${formatPrice(0, currency)} — leave blank for none`}
          onChange={(e) => setPriceInput(formatCurrency(e.target.value))}
        />
      </CardRow>

      <CardRow
        label="Styles you don't do"
        description="Requests in these styles get flagged as a possible mismatch."
        value={styleLabels}
        stacked
      >
        <TattooStylesPicker
          value={draft.declinedStyles}
          onChange={(declinedStyles) => update({ declinedStyles })}
        />
      </CardRow>

      <CardRow
        label="Placements you won't tattoo"
        description="Requests for these placements get flagged."
        value={settings.declinedPlacements.join(", ")}
        stacked
      >
        <ChipMultiSelect
          value={draft.declinedPlacements}
          options={PLACEMENT_CHIP_OPTIONS}
          onChange={(declinedPlacements) => update({ declinedPlacements })}
        />
      </CardRow>

      <CardRow
        label="About your work"
        description="What you specialize in, what you take, and what you turn down — in your words."
        value={settings.workSummary}
        stacked
      >
        <Textarea
          value={draft.workSummary}
          rows={5}
          placeholder="e.g. I focus on fine-line botanical and lettering. I don't do color realism or cover-ups, and I won't copy another artist's work."
          onChange={(e) => update({ workSummary: e.target.value })}
        />
      </CardRow>
    </EditableCard>
  );
};
