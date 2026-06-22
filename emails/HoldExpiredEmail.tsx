// Email
import { Heading, Text } from "@react-email/components";

// Components
import { EmailLayout } from "./EmailLayout";

// Libs
import { styles } from "./theme";

export type HoldExpiredAudience = "client" | "artist";

export interface HoldExpiredEmailProps {
  audience: HoldExpiredAudience;
  clientName: string;
  artistName: string;
}

export const HoldExpiredEmail = ({
  audience,
  clientName,
  artistName,
}: HoldExpiredEmailProps) => {
  const isClient = audience === "client";
  const preview = isClient
    ? `Your held time with ${artistName} was released`
    : `${clientName}'s held session was released`;

  return (
    <EmailLayout preview={preview} artistName={artistName}>
      <Heading style={styles.greeting}>
        {isClient ? `Hi, ${clientName}` : "A held session lapsed"}
      </Heading>
      <Text style={styles.lead}>
        {isClient
          ? `The deposit for your session with ${artistName} wasn't paid in time, so the held time has been released.`
          : `${clientName} didn't pay their deposit in time, so the held slot has been released and is open again.`}
      </Text>
      <Text style={styles.paragraph}>
        {isClient
          ? `Still want the appointment? Reach out to ${artistName} to set up a new time.`
          : "No action needed. You can re-schedule with the client whenever you're ready."}
      </Text>
    </EmailLayout>
  );
};

(HoldExpiredEmail as { PreviewProps?: HoldExpiredEmailProps }).PreviewProps = {
  audience: "client",
  clientName: "Justin Neale",
  artistName: "Josh Allen",
};

export default HoldExpiredEmail;
