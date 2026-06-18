// Email
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

// Libs
import { styles } from "./theme";
import { INKSPACE_LOGO_URL } from "@/constants/emails";

interface EmailLayoutProps {
  preview: string;
  artistName: string;
  children: React.ReactNode;
}

export const EmailLayout = ({
  preview,
  artistName,
  children,
}: EmailLayoutProps) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Body style={styles.body}>
      <Container style={styles.container}>
        <Section style={styles.header}>
          <Section style={styles.badge}>
            <Img
              src={INKSPACE_LOGO_URL}
              width="46"
              height="46"
              alt="Inkspace"
              style={styles.logo}
            />
          </Section>
        </Section>
        <Section style={styles.content}>{children}</Section>
        <Hr style={styles.hr} />
        <Section style={styles.footer}>
          <Text style={styles.footerText}>
            Sent by Inkspace on behalf of {artistName}.
          </Text>
          <Text style={styles.footerText}>© 2026 Inkspace Inc.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
