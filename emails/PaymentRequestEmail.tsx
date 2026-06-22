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
import type { PaymentType } from "@/types/bookings";

export interface PaymentRequestEmailProps {
  clientName: string;
  artistName: string;
  type: PaymentType;
  amountCents: number;
  currency: string;
  payUrl: string;
}

export const PaymentRequestEmail = ({
  clientName,
  artistName,
  type,
  amountCents,
  currency,
  payUrl,
}: PaymentRequestEmailProps) => {
  const amount = formatPrice(amountCents, currency);
  const isDeposit = type === "deposit";
  const lead = isDeposit
    ? `${artistName} has requested a deposit to lock in your upcoming booking.`
    : `${artistName} has requested payment for your tattoo session.`;
  const bodyParagraphs = isDeposit
    ? [
        "A deposit holds your spot and counts toward the final cost of your tattoo. You can pay it in just a few seconds using the secure button below.",
        "Your payment is processed end-to-end by Stripe, so your card details are never shared with Inkspace or your artist. As soon as it's received, your booking is confirmed and you're all set.",
      ]
    : [
        "Log in or create your Inkspace account from the button below, then settle up securely from your dashboard.",
        "Your payment is processed end-to-end by Stripe, so your card details are never shared with Inkspace or your artist. Once it goes through, you'll get a confirmation that everything's taken care of.",
      ];
  const summaryLabel = isDeposit ? "Deposit due" : "Payment due";
  const buttonLabel = isDeposit ? "Pay deposit" : "Pay for session";
  const preview = `${artistName} requested ${amount}`;

  return (
    <EmailLayout preview={preview} artistName={artistName}>
      <Heading style={styles.greeting}>Hi, {clientName}</Heading>
      <Text style={styles.lead}>{lead}</Text>
      {bodyParagraphs.map((paragraph) => (
        <Text key={paragraph} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}

      <Section style={styles.summary}>
        <Row style={styles.summaryRow}>
          <Column style={styles.summaryLabel}>{summaryLabel}</Column>
          <Column style={styles.summaryValue}>{amount}</Column>
        </Row>
      </Section>

      <Section style={styles.buttonWrap}>
        <Button href={payUrl} style={styles.button}>
          {buttonLabel}
        </Button>
      </Section>

      <Text style={styles.fineprint}>
        This payment link was created just for you and will expire in 7 days.
      </Text>
    </EmailLayout>
  );
};

(
  PaymentRequestEmail as { PreviewProps?: PaymentRequestEmailProps }
).PreviewProps = {
  clientName: "Justin Neale",
  artistName: "Josh Allen",
  type: "deposit",
  amountCents: 22000,
  currency: "CAD",
  payUrl: "https://inkspace.com/pay/preview-token",
};

export default PaymentRequestEmail;