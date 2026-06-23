// Email
import { Button, Heading, Section, Text } from "@react-email/components";

// Components
import { EmailLayout } from "./EmailLayout";

// Libs
import { styles } from "./theme";

export interface NewMessageEmailProps {
  recipientName: string;
  senderName: string;
  artistName: string;
  url: string;
}

export const NewMessageEmail = ({
  recipientName,
  senderName,
  artistName,
  url,
}: NewMessageEmailProps) => {
  const preview = `New message from ${senderName}`;

  return (
    <EmailLayout preview={preview} artistName={artistName}>
      <Heading style={styles.greeting}>Hi, {recipientName}</Heading>
      <Text style={styles.lead}>{senderName} sent you a new message.</Text>
      <Text style={styles.paragraph}>
        Tap the button below to read it and reply.
      </Text>

      <Section style={styles.buttonWrap}>
        <Button href={url} style={styles.button}>
          View message
        </Button>
      </Section>
    </EmailLayout>
  );
};

(NewMessageEmail as { PreviewProps?: NewMessageEmailProps }).PreviewProps = {
  recipientName: "Riley Park",
  senderName: "Diego Viera",
  artistName: "Diego Viera",
  url: "https://inkspace.com/messages/preview-token",
};

export default NewMessageEmail;
