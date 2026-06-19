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
import { formatDurationMinutes } from "@/lib/formatters";

export interface BookingRequestEmailProps {
  clientName: string;
  artistName: string;
  durationMinutes: number;
  bookingUrl: string;
}

export const BookingRequestEmail = ({
  clientName,
  artistName,
  durationMinutes,
  bookingUrl,
}: BookingRequestEmailProps) => {
  const length = formatDurationMinutes(durationMinutes);
  const lead = `${artistName} accepted your request and would like you to pick a time that works for you.`;
  const preview = `Pick a time for your booking with ${artistName}`;

  return (
    <EmailLayout preview={preview} artistName={artistName}>
      <Heading style={styles.greeting}>Hi, {clientName}</Heading>
      <Text style={styles.lead}>{lead}</Text>
      <Text style={styles.paragraph}>
        Tap the button below to choose a slot from {artistName}&apos;s calendar.
        You&apos;ll sign in or create a quick account (with this email) to
        confirm your time.
      </Text>
      <Text style={styles.paragraph}>
        Your session is reserved for {length} — just pick the start time that
        suits you and you&apos;re booked in.
      </Text>

      <Section style={styles.summary}>
        <Row style={styles.summaryRow}>
          <Column style={styles.summaryLabel}>Session length</Column>
          <Column style={styles.summaryValue}>{length}</Column>
        </Row>
      </Section>

      <Section style={styles.buttonWrap}>
        <Button href={bookingUrl} style={styles.button}>
          Pick your time
        </Button>
      </Section>

      <Text style={styles.fineprint}>
        This booking link was created just for you.
      </Text>
    </EmailLayout>
  );
};

(
  BookingRequestEmail as { PreviewProps?: BookingRequestEmailProps }
).PreviewProps = {
  clientName: "Justin Neale",
  artistName: "Josh Allen",
  durationMinutes: 180,
  bookingUrl: "https://inkspace.com/book/preview-token",
};

export default BookingRequestEmail;
