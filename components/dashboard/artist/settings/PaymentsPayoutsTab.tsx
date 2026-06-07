"use client";

// Next.js
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// CSS
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import StripeLogo from "@/public/logos/stripe-logo.svg";

// Components
import { EditableCard, StaticCard, CardRow } from "./SettingsPrimitives";
import { OptionsSelect } from "@/components/common/OptionsSelect";
import { ConnectionCard } from "./ConnectionCard";

// Hooks
import { useDraftState } from "@/hooks/useDraftState";

// Libs
import { getChangedFields, hasUnsavedChanges } from "@/lib/settings";
import { displayToast } from "@/lib/toast";
import {
  CURRENCY_OPTIONS,
  PAYOUT_FREQUENCY_OPTIONS,
} from "@/constants/settings";
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";
import type { ArtistSettings, PayoutFrequency } from "@/types/settings";
import { formatSelectValue } from "@/lib/formatters";

type Draft = Pick<ArtistSettings, "payoutFrequency" | "currency">;
const KEYS: (keyof Draft)[] = ["payoutFrequency", "currency"];

export const PaymentsPayoutsTab = ({
  controller,
}: {
  controller: ArtistSettingsController;
}) => {
  const { data, saveSettings, connectStripe, refreshStripeStatus, disconnectStripe } =
    controller;
  const settings = data?.settings;

  const router = useRouter();
  const searchParams = useSearchParams();

  const { draft, update, reset } = useDraftState<Draft>({
    payoutFrequency: settings?.payoutFrequency ?? "weekly",
    currency: settings?.currency ?? "CAD",
  });

  const stripeReturn = searchParams.get("stripe");
  const handledReturn = useRef(false);
  useEffect(() => {
    if (!stripeReturn || handledReturn.current) return;
    handledReturn.current = true;
    void refreshStripeStatus().catch(() => {});
    router.replace("/dashboard/artist/settings?tab=payments");
  }, [stripeReturn, refreshStripeStatus, router]);

  if (!settings) return null;

  const onboardingIncomplete =
    settings.stripeConnected && !settings.stripeChargesEnabled;

  const handleConnect = async () => {
    try {
      const { url } = await connectStripe();
      window.location.href = url;
    } catch {
      displayToast(
        "Couldn't start Stripe connection",
        "error",
        "Please try again in a moment.",
      );
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectStripe();
      displayToast("Stripe disconnected", "success");
    } catch {
      displayToast(
        "Couldn't disconnect Stripe",
        "error",
        "Please try again in a moment.",
      );
    }
  };

  return (
    <>
      <StaticCard
        title="Payouts"
        description="Connect a Stripe account to receive deposit payouts from your clients."
      >
        <ConnectionCard
          logo={<StripeLogo className={styles.connectionLogoStripe} />}
          title="Stripe"
          subtitle={
            onboardingIncomplete
              ? "Onboarding incomplete — finish setup to receive payouts."
              : "Not connected — connect to start receiving payouts."
          }
          connected={settings.stripeChargesEnabled}
          connectedDetail="Connected — payouts go to your Stripe account."
          connectLabel={
            onboardingIncomplete ? "Continue onboarding" : "Connect Stripe"
          }
          onConnect={() => void handleConnect()}
          onDisconnect={() => void handleDisconnect()}
        />
      </StaticCard>

      <EditableCard
        title="Payout settings"
        onSubmit={() => saveSettings(getChangedFields(settings, draft, KEYS))}
        successToast="Payout settings updated"
        errorToast="Couldn't save payment settings"
        onCancel={reset}
        disableSubmit={!hasUnsavedChanges(settings, draft, KEYS)}
      >
        <CardRow
          label="Payout frequency"
          description="How often your available balance is paid out."
          value={formatSelectValue(
            settings.payoutFrequency,
            PAYOUT_FREQUENCY_OPTIONS,
          )}
        >
          <OptionsSelect
            ariaLabel="Payout frequency"
            className={styles.controlFull}
            value={draft.payoutFrequency}
            options={PAYOUT_FREQUENCY_OPTIONS}
            onValueChange={(value) =>
              update({ payoutFrequency: value as PayoutFrequency })
            }
          />
        </CardRow>
        <CardRow
          label="Currency"
          description="The currency clients are charged in. Tied to your Stripe locale."
          value={formatSelectValue(settings.currency, CURRENCY_OPTIONS)}
        >
          <OptionsSelect
            ariaLabel="Currency"
            className={styles.controlFull}
            value={draft.currency}
            options={CURRENCY_OPTIONS}
            onValueChange={(currency) => update({ currency })}
          />
        </CardRow>
      </EditableCard>
    </>
  );
};
