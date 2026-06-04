"use client";

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
  const { data, saveSettings } = controller;
  const settings = data?.settings;

  const { draft, update, reset } = useDraftState<Draft>({
    payoutFrequency: settings?.payoutFrequency ?? "weekly",
    currency: settings?.currency ?? "CAD",
  });

  if (!settings) return null;

  return (
    <>
      <StaticCard
        title="Payouts"
        description="Connect a Stripe account to receive deposit payouts from your clients."
      >
        <ConnectionCard
          logo={<StripeLogo className={styles.connectionLogoStripe} />}
          title="Stripe"
          subtitle="Not connected — connect to start receiving payouts."
          connected={settings.stripeConnected}
          connectedDetail="Payouts are sent to your connected Stripe account."
          connectLabel="Connect Stripe"
          onConnect={() =>
            displayToast(
              "Stripe Connect is coming soon.",
              "info",
              "You'll be able to link your Stripe account here shortly.",
            )
          }
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
