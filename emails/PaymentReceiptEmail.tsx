// Email
import {
  Column,
  Heading,
  Hr,
  Row,
  Section,
  Text,
} from "@react-email/components";

// Components
import { EmailLayout } from "./EmailLayout";

// Libs
import { styles } from "./theme";
import { formatDate, formatPrice } from "@/lib/formatters";
import type { PaymentType } from "@/types/bookings";

export interface PaymentReceiptEmailProps {
  clientName: string;
  artistName: string;
  type: PaymentType;
  amountCents: number;
  currency: string;
  paidAt: string;
  reference: string;
}

export const PaymentReceiptEmail = ({
  clientName,
  artistName,
  type,
  amountCents,
  currency,
  paidAt,
  reference,
}: PaymentReceiptEmailProps) => {
  const amount = formatPrice(amountCents, currency);
  const isDeposit = type === "deposit";
  const lead = isDeposit
    ? `Good news, your deposit has been received.`
    : `Good news, your payment has been received.`;
  const body = isDeposit
    ? `Your deposit of ${amount} is secured and counts toward the final cost of your tattoo. Your booking with ${artistName} is confirmed, and they'll reach out with any next steps.`
    : `Your payment of ${amount} for your session with ${artistName} is complete. You're all set.`;
  const shortReference = `#${reference.slice(0, 8).toUpperCase()}`;
  const preview = `Receipt for your ${amount} payment to ${artistName}`;

  return (
    <EmailLayout preview={preview} artistName={artistName}>
      <Heading style={styles.greeting}>Hi, {clientName}</Heading>
      <Text style={styles.lead}>{lead}</Text>
      <Text style={styles.paragraph}>{body}</Text>

      <Section style={styles.summary}>
        <Row style={styles.summaryRow}>
          <Column style={styles.summaryLabel}>Amount paid</Column>
          <Column style={styles.summaryAmount}>{amount}</Column>
        </Row>
        <Hr style={styles.summaryDivider} />
        <Row style={styles.summaryRow}>
          <Column style={styles.summaryLabel}>Paid to</Column>
          <Column style={styles.summaryValue}>{artistName}</Column>
        </Row>
        <Row style={styles.summaryRow}>
          <Column style={styles.summaryLabel}>Date</Column>
          <Column style={styles.summaryValue}>{formatDate(paidAt)}</Column>
        </Row>
        <Row style={styles.summaryRow}>
          <Column style={styles.summaryLabel}>Reference</Column>
          <Column style={styles.summaryValue}>{shortReference}</Column>
        </Row>
      </Section>

      <Text style={styles.fineprint}>
        Keep this email for your records. Questions? Just reply and your artist
        will get back to you.
      </Text>
    </EmailLayout>
  );
};

(
  PaymentReceiptEmail as { PreviewProps?: PaymentReceiptEmailProps }
).PreviewProps = {
  clientName: "Justin Neale",
  artistName: "Josh Allen",
  type: "deposit",
  amountCents: 22000,
  currency: "CAD",
  paidAt: "2026-06-15T18:30:00Z",
  reference: "a1b2c3d4e5f6",
};

export default PaymentReceiptEmail;
