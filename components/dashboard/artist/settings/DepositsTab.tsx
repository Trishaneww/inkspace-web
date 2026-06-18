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
import { FEE_PAYER_OPTIONS, REFUND_POLICY_OPTIONS } from "@/constants/settings";
import { convertDollarsToCents } from "@/lib/flashes";
import {
  formatCentsAsInput,
  formatCurrency,
  formatPrice,
  formatSelectValue,
} from "@/lib/formatters";
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";
import type {
  DepositRefundPolicy,
  PlatformFeePayer,
  UpdateSettingsPayload,
} from "@/types/settings";
import { parseHourCount } from "@/lib/settings";

export const DepositsTab = ({
  controller,
}: {
  controller: ArtistSettingsController;
}) => {
  const { data, saveSettings } = controller;
  const settings = data?.settings;

  const [feeInput, setFeeInput] = useState(
    formatCentsAsInput(settings?.depositFlatFeeCents ?? null),
  );
  const [feePayer, setFeePayer] = useState<PlatformFeePayer>(
    settings?.platformFeePayer ?? "client",
  );

  const [refundPolicy, setRefundPolicy] = useState<DepositRefundPolicy>(
    settings?.depositRefundPolicy ?? "non_refundable",
  );
  const [noticeHoursInput, setNoticeHoursInput] = useState(
    settings?.cancellationNoticeHours != null
      ? String(settings.cancellationNoticeHours)
      : "",
  );

  if (!settings) return null;

  const parsedFeeCents = convertDollarsToCents(feeInput);
  const feeChanged = parsedFeeCents !== settings.depositFlatFeeCents;
  const payerChanged = feePayer !== settings.platformFeePayer;

  const resetDeposits = () => {
    setFeeInput(formatCentsAsInput(settings.depositFlatFeeCents));
    setFeePayer(settings.platformFeePayer);
  };

  const handleDepositsSubmit = async () => {
    const patch: UpdateSettingsPayload = {};
    if (payerChanged) patch.platformFeePayer = feePayer;
    if (feeChanged) {
      if (parsedFeeCents == null) patch.clearDepositFlatFee = true;
      else patch.depositFlatFeeCents = parsedFeeCents;
    }
    await saveSettings(patch);
  };

  const usesWindow = refundPolicy === "refundable_within_window";
  const savedHours = settings.cancellationNoticeHours;
  const parsedNoticeHours = parseHourCount(noticeHoursInput);
  const policyChanged = refundPolicy !== settings.depositRefundPolicy;
  const hoursChanged = usesWindow && parsedNoticeHours !== savedHours;

  const resetRefunds = () => {
    setRefundPolicy(settings.depositRefundPolicy);
    setNoticeHoursInput(
      settings.cancellationNoticeHours != null
        ? String(settings.cancellationNoticeHours)
        : "",
    );
  };

  const handleRefundsSubmit = async () => {
    const patch: UpdateSettingsPayload = {};
    if (policyChanged) patch.depositRefundPolicy = refundPolicy;
    if (usesWindow) {
      if (parsedNoticeHours == null) {
        throw new Error(
          "Enter the cancellation notice in whole hours (e.g. 48).",
        );
      }
      if (parsedNoticeHours !== savedHours) patch.cancellationNoticeHours = parsedNoticeHours;
    } else if (savedHours != null) {
      patch.clearCancellationNotice = true;
    }
    await saveSettings(patch);
  };

  return (
    <>
      <EditableCard
        title="Deposits & fees"
        description="Set a fixed deposit, or leave it blank to choose a custom amount per client when you send the deposit link."
        onSubmit={handleDepositsSubmit}
        successToast="Deposits updated"
        errorToast="Couldn't save deposit settings"
        onCancel={resetDeposits}
        disableSubmit={!feeChanged && !payerChanged}
      >
        <CardRow
          label="Flat deposit fee"
          description="Optional. The deposit clients pay to confirm a booking."
          value={
            settings.depositFlatFeeCents != null
              ? formatPrice(settings.depositFlatFeeCents, settings.currency)
              : "No fixed deposit"
          }
        >
          <Input
            type="text"
            inputMode="decimal"
            value={feeInput}
            placeholder="$0.00"
            className={styles.controlFull}
            onChange={(e) => setFeeInput(formatCurrency(e.target.value))}
          />
        </CardRow>
        <CardRow
          label="Who pays the platform fee"
          description="Inkspace adds a small fee ($5-20) on top of your deposit. Choose who covers it."
          value={formatSelectValue(
            settings.platformFeePayer,
            FEE_PAYER_OPTIONS,
          )}
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

      <EditableCard
        title="Cancellation & refunds"
        description="What clients agree to when they pay a deposit. The policy shown to them is recorded with each payment as evidence if they later dispute the charge."
        onSubmit={handleRefundsSubmit}
        successToast="Refund policy updated"
        errorToast="Couldn't save refund policy"
        onCancel={resetRefunds}
        disableSubmit={!policyChanged && !hoursChanged}
      >
        <CardRow
          label="Deposit refund policy"
          description="Whether a client can get their deposit back after paying."
          value={formatSelectValue(
            settings.depositRefundPolicy,
            REFUND_POLICY_OPTIONS,
          )}
        >
          <OptionsSelect
            ariaLabel="Deposit refund policy"
            className={styles.controlFull}
            value={refundPolicy}
            options={REFUND_POLICY_OPTIONS}
            onValueChange={(value) =>
              setRefundPolicy(value as DepositRefundPolicy)
            }
          />
        </CardRow>
        {usesWindow && (
          <CardRow
            label="Cancellation notice"
            description="How many hours before the booking a client must cancel to get a refund."
            value={
              settings.cancellationNoticeHours != null
                ? `${settings.cancellationNoticeHours} hours before the appointment`
                : "Not set"
            }
          >
            <Input
              type="text"
              inputMode="numeric"
              value={noticeHoursInput}
              placeholder="e.g. 48"
              className={styles.controlFull}
              onChange={(e) =>
                setNoticeHoursInput(e.target.value.replace(/[^0-9]/g, ""))
              }
            />
          </CardRow>
        )}
      </EditableCard>
    </>
  );
};
