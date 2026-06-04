"use client";

// Next.js
import { useState } from "react";

// CSS
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import { Input } from "@/components/ui/input";

// Components
import { EditableCard, CardRow } from "./SettingsPrimitives";
import { OptionsSelect } from "@/components/common/OptionsSelect";

// Libs
import { FEE_PAYER_OPTIONS } from "@/constants/settings";
import { convertDollarsToCents } from "@/lib/flashes";
import {
  formatCentsAsInput,
  formatCurrency,
  formatSelectValue,
  formatPriceCents,
} from "@/lib/formatters";
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";
import type { PlatformFeePayer, UpdateSettingsPayload } from "@/types/settings";

export const DepositsTab = ({
  controller,
}: {
  controller: ArtistSettingsController;
}) => {
  const { data, saveSettings } = controller;
  const settings = data?.settings;

  const [feeStr, setFeeStr] = useState(
    formatCentsAsInput(settings?.depositFlatFeeCents ?? null),
  );
  const [feePayer, setFeePayer] = useState<PlatformFeePayer>(
    settings?.platformFeePayer ?? "client",
  );

  if (!settings) return null;

  const nextCents = convertDollarsToCents(feeStr);
  const feeChanged = nextCents !== settings.depositFlatFeeCents;
  const payerChanged = feePayer !== settings.platformFeePayer;

  const reset = () => {
    setFeeStr(formatCentsAsInput(settings.depositFlatFeeCents));
    setFeePayer(settings.platformFeePayer);
  };

  const handleSubmit = async () => {
    const patch: UpdateSettingsPayload = {};
    if (payerChanged) patch.platformFeePayer = feePayer;
    if (feeChanged) {
      if (nextCents == null) patch.clearDepositFlatFee = true;
      else patch.depositFlatFeeCents = nextCents;
    }
    await saveSettings(patch);
  };

  return (
    <EditableCard
      title="Deposits & fees"
      description="Set a fixed deposit, or leave it blank to choose a custom amount per client when you send the deposit link."
      onSubmit={handleSubmit}
      successToast="Deposits updated"
      errorToast="Couldn't save deposit settings"
      onCancel={reset}
      disableSubmit={!feeChanged && !payerChanged}
    >
      <CardRow
        label="Flat deposit fee"
        description="Optional. The deposit clients pay to confirm a booking."
        value={
          settings.depositFlatFeeCents != null
            ? formatPriceCents(settings.depositFlatFeeCents, settings.currency)
            : "No fixed deposit"
        }
      >
        <Input
          type="text"
          inputMode="decimal"
          value={feeStr}
          placeholder="$0.00"
          className={styles.controlFull}
          onChange={(e) => setFeeStr(formatCurrency(e.target.value))}
        />
      </CardRow>
      <CardRow
        label="Who pays the platform fee"
        description="Inkspace adds a small fee ($5-20) on top of your deposit. Choose who covers it."
        value={formatSelectValue(settings.platformFeePayer, FEE_PAYER_OPTIONS)}
      >
        <OptionsSelect
          ariaLabel="Who pays the platform fee"
          className={styles.controlFull}
          value={feePayer}
          options={FEE_PAYER_OPTIONS}
          onValueChange={(value) => setFeePayer(value as PlatformFeePayer)}
        />
      </CardRow>
    </EditableCard>
  );
};
