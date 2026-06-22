// Email
import { Column, Heading, Row, Section, Text } from "@react-email/components";

// Components
import { EmailLayout } from "./EmailLayout";

// Libs
import { styles } from "./theme";
import { formatDurationMinutes } from "@/lib/formatters";

export interface BookingConfirmedEmailProps {
  clientName: string;
  artistName: string;
  whenLabel: string;
  durationMinutes: number;
}

export const BookingConfirmedEmail = ({
  clientName,
  artistName,
  whenLabel,
  durationMinutes,
}: BookingConfirmedEmailProps) => {
  const length = formatDurationMinutes(durationMinutes);
  const preview = `You're booked with ${artistName} — ${whenLabel}`;

  return (
    <EmailLayout preview={preview} artistName={artistName}>
      <Heading style={styles.greeting}>Hi, {clientName}</Heading>
      <Text style={styles.lead}>
        You&apos;re booked in with {artistName}. Here are your details.
      </Text>

      <Section style={{ ...styles.summary, margin: "16px 0 20px" }}>
        <Row style={styles.summaryRow}>
          <Column style={styles.summaryLabel}>When</Column>
          <Column style={styles.summaryValue}>{whenLabel}</Column>
        </Row>
        <Row style={styles.summaryRow}>
          <Column style={styles.summaryLabel}>Session length</Column>
          <Column style={styles.summaryValue}>{length}</Column>
        </Row>
      </Section>

      <Text style={styles.paragraph}>
        You can view this booking any time from your Inkspace dashboard. If you
        need to change the time, reach out to {artistName}.
      </Text>
    </EmailLayout>
  );
};

(
  BookingConfirmedEmail as { PreviewProps?: BookingConfirmedEmailProps }
).PreviewProps = {
  clientName: "Justin Neale",
  artistName: "Josh Allen",
  whenLabel: "Friday, June 20 at 2:00 PM",
  durationMinutes: 180,
};

export default BookingConfirmedEmail;
