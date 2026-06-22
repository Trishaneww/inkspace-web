// Email
import {
  Button,
  Column,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";

// Components
import { EmailLayout } from "./EmailLayout";

// Libs
import { styles } from "./theme";
import { formatPrice } from "@/lib/formatters";

export interface DepositRequestEmailProps {
  clientName: string;
  artistName: string;
  amountCents: number;
  currency: string;
  whenLabel: string;
  payUrl: string;
}

export const DepositRequestEmail = ({
  clientName,
  artistName,
  amountCents,
  currency,
  whenLabel,
  payUrl,
}: DepositRequestEmailProps) => {
  const amount = formatPrice(amountCents, currency);
  const preview = `${artistName} held your session, pay ${amount} to confirm`;

  return (
    <EmailLayout preview={preview} artistName={artistName}>
      <Heading style={styles.greeting}>Hi, {clientName}</Heading>
      <Text style={styles.lead}>
        {artistName} is holding a session for you. Pay your deposit to lock it
        in. It counts toward the final cost of your tattoo.
      </Text>
      <Text style={styles.paragraph}>
        Log in or create your Inkspace account from the button below, then pay
        securely from your dashboard. We&apos;ll hold the time for 48 hours.
      </Text>

      <Section style={styles.summary}>
        {whenLabel ? (
          <Row style={styles.summaryRow}>
            <Column style={styles.summaryLabel}>When</Column>
            <Column style={styles.summaryValue}>{whenLabel}</Column>
          </Row>
        ) : null}
        <Row style={styles.summaryRow}>
          <Column style={styles.summaryLabel}>Deposit due</Column>
          <Column style={styles.summaryValue}>{amount}</Column>
        </Row>
      </Section>

      <Section style={styles.buttonWrap}>
        <Button href={payUrl} style={styles.button}>
          Pay deposit
        </Button>
      </Section>

      <Text style={styles.fineprint}>
        If the deposit isn&apos;t paid within 48 hours, the held time is released.
      </Text>
    </EmailLayout>
  );
};

(
  DepositRequestEmail as { PreviewProps?: DepositRequestEmailProps }
).PreviewProps = {
  clientName: "Justin Neale",
  artistName: "Josh Allen",
  amountCents: 20000,
  currency: "CAD",
  whenLabel: "Friday, June 20 at 2:00 PM",
  payUrl: "https://inkspace.com/pay/preview-token",
};

export default DepositRequestEmail;
