"use client";

// Next.js
import { useState } from "react";
import { useSearchParams } from "next/navigation";

// CSS
import styles from "@/styles/dashboard/messaging/Messages.module.css";

// Components
import { ConversationList } from "./ConversationList";
import { MessageThread } from "./MessageThread";

// Hooks
import { useConversations, useThread } from "@/hooks/useMessaging";

// Libs
import { useAuth } from "@/lib/auth";
import { displayToast } from "@/lib/toast";

export const DashboardMessages = ({ scope }: { scope: "artist" | "client" }) => {
  const { token, user } = useAuth();
  const searchParams = useSearchParams();
  const { conversations } = useConversations(scope);

  const viewerName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "You";

  const [selectedId, setSelectedId] = useState<string | null>(
    searchParams.get("c"),
  );
  const activeId = selectedId ?? conversations[0]?.id ?? null;

  const { thread, isSending, send } = useThread(scope, token, activeId);

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

  const viewerType = scope === "artist" ? "artist" : "client";

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <ConversationList
          conversations={conversations}
          scope={scope}
          activeId={activeId}
          onSelect={setSelectedId}
        />
      </aside>
      <section className={styles.main}>
        <MessageThread
          thread={thread}
          viewerType={viewerType}
          viewerName={viewerName}
          viewerAvatarUrl={user?.avatarUrl}
          isSending={isSending}
          onSend={handleSend}
          emptyHint={
            conversations.length === 0
              ? "No conversations yet."
              : "Select a conversation"
          }
        />
      </section>
    </div>
  );
};
