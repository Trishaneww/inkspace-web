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

export interface PaymentReminderEmailProps {
  clientName: string;
  artistName: string;
  amountCents: number;
  currency: string;
  payUrl: string;
}

export const PaymentReminderEmail = ({
  clientName,
  artistName,
  amountCents,
  currency,
  payUrl,
}: PaymentReminderEmailProps) => {
  const amount = formatPrice(amountCents, currency);
  const preview = `Reminder: ${amount} is still due to ${artistName}`;

  return (
    <EmailLayout preview={preview} artistName={artistName}>
      <Heading style={styles.greeting}>Hi, {clientName}</Heading>
      <Text style={styles.lead}>
        Just a friendly reminder that your payment to {artistName} is still
        waiting.
      </Text>
      <Text style={styles.paragraph}>
        You can take care of it in a few seconds with the secure button below.
        Your payment is processed end-to-end by Stripe, so your card details are
        never shared with Inkspace or your artist.
      </Text>

      <Section style={styles.summary}>
        <Row style={styles.summaryRow}>
          <Column style={styles.summaryLabel}>Amount due</Column>
          <Column style={styles.summaryValue}>{amount}</Column>
        </Row>
      </Section>

      <Section style={styles.buttonWrap}>
        <Button href={payUrl} style={styles.button}>
          Pay now
        </Button>
      </Section>

      <Text style={styles.fineprint}>
        If you have already paid, you can ignore this email. Your payment link
        will expire soon.
      </Text>
    </EmailLayout>
  );
};

(
  PaymentReminderEmail as { PreviewProps?: PaymentReminderEmailProps }
).PreviewProps = {
  clientName: "Justin Neale",
  artistName: "Josh Allen",
  amountCents: 22000,
  currency: "CAD",
  payUrl: "https://inkspace.com/pay/preview-token",
};

export default PaymentReminderEmail;
