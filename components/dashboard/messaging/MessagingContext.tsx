"use client";

// Next.js
import { createContext, useContext, useMemo } from "react";

// Hooks
import { useConversations } from "@/hooks/useMessaging";

// Libs
import type { ConversationSummary } from "@/types/messaging";

interface MessagingContextValue {
  conversations: ConversationSummary[];
  unreadCount: number;
}

const MessagingContext = createContext<MessagingContextValue | null>(null);

export const MessagingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { conversations } = useConversations("artist");

  const unreadCount = useMemo(
    () => conversations.filter((conversation) => conversation.hasUnread).length,
    [conversations],
  );

  const value = useMemo(
    () => ({ conversations, unreadCount }),
    [conversations, unreadCount],
  );

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error("useMessaging must be used within a MessagingProvider");
  }
  return context;
};
