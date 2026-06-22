// Email
import { Column, Heading, Row, Section, Text } from "@react-email/components";

// Components
import { EmailLayout } from "./EmailLayout";

// Libs
import { styles } from "./theme";
import { formatDurationMinutes, formatPrice } from "@/lib/formatters";

export interface DepositPaidEmailProps {
  artistName: string;
  clientName: string;
  amountCents: number;
  currency: string;
  whenLabel: string;
  durationMinutes: number;
}

export const DepositPaidEmail = ({
  artistName,
  clientName,
  amountCents,
  currency,
  whenLabel,
  durationMinutes,
}: DepositPaidEmailProps) => {
  const amount = formatPrice(amountCents, currency);
  const length = formatDurationMinutes(durationMinutes);
  const preview = `${clientName} paid their ${amount} deposit`;

  return (
    <EmailLayout preview={preview} artistName={artistName}>
      <Heading style={styles.greeting}>Nice — you got paid</Heading>
      <Text style={styles.lead}>
        {clientName} paid their deposit, so the session is confirmed and on your
        calendar.
      </Text>

      <Section style={{ ...styles.summary, margin: "16px 0 20px" }}>
        <Row style={styles.summaryRow}>
          <Column style={styles.summaryLabel}>Client</Column>
          <Column style={styles.summaryValue}>{clientName}</Column>
        </Row>
        {whenLabel ? (
          <Row style={styles.summaryRow}>
            <Column style={styles.summaryLabel}>When</Column>
            <Column style={styles.summaryValue}>{whenLabel}</Column>
          </Row>
        ) : null}
        <Row style={styles.summaryRow}>
          <Column style={styles.summaryLabel}>Session length</Column>
          <Column style={styles.summaryValue}>{length}</Column>
        </Row>
        <Row style={styles.summaryRow}>
          <Column style={styles.summaryLabel}>Deposit</Column>
          <Column style={styles.summaryValue}>{amount}</Column>
        </Row>
      </Section>

      <Text style={styles.paragraph}>
        You can charge the remaining balance any time from the booking in your
        Inkspace dashboard.
      </Text>
    </EmailLayout>
  );
};

(DepositPaidEmail as { PreviewProps?: DepositPaidEmailProps }).PreviewProps = {
  artistName: "Josh Allen",
  clientName: "Justin Neale",
  amountCents: 20000,
  currency: "CAD",
  whenLabel: "Friday, June 20 at 2:00 PM",
  durationMinutes: 180,
};

export default DepositPaidEmail;
