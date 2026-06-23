"use client";

// Next.js
import Image from "next/image";
import { useParams } from "next/navigation";

// CSS
import styles from "@/styles/dashboard/messaging/Messages.module.css";

// HTML Components
import { CircleAlert, Loader2 } from "lucide-react";

// Components
import { MessageThread } from "@/components/dashboard/messaging/MessageThread";

// Hooks
import { useThread } from "@/hooks/useMessaging";

// Libs
import { displayToast } from "@/lib/toast";

export default function GuestMessagesPage() {
  const params = useParams<{ token: string }>();
  const token = String(params.token);
  const { thread, isLoading, isSending, send } = useThread(
    "guest",
    null,
    token,
  );

  const handleSend = async (body: string) => {
    const ok = await send(body);
    if (!ok) {
      displayToast(
        "Couldn't send message",
        "error",
        "Please try again in a moment.",
      );
    }
    return ok;
  };

  return (
    <main className={styles.guestPage}>
      <div className={styles.guestCard}>
        <div className={styles.guestHeader}>
          <Image
            src="/logos/inkspace-logo.svg"
            alt="Inkspace"
            width={26}
            height={26}
          />
          <span className={styles.guestBrand}>Inkspace</span>
        </div>

        {isLoading ? (
          <div className={styles.guestState}>
            <Loader2 size={22} className="animate-spin" />
          </div>
        ) : !thread ? (
          <div className={styles.guestState}>
            <CircleAlert size={26} />
            <p>This conversation link is invalid or has expired.</p>
          </div>
        ) : (
          <MessageThread
            thread={thread}
            viewerType="client"
            viewerName={thread.clientName || "You"}
            isSending={isSending}
            onSend={handleSend}
          />
        )}
      </div>
    </main>
  );
}
