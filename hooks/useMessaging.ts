// Next.js
import { useCallback, useEffect, useState } from "react";

// Libs
import { useAuth } from "@/lib/auth";
import { messagingApi } from "@/lib/api/messaging";
import type {
  ConversationSummary,
  ConversationThread,
} from "@/types/messaging";

export type ThreadScope = "artist" | "client" | "guest";

const LIST_POLL_MS = 10_000;
const THREAD_POLL_MS = 8_000;

export const useConversations = (scope: "artist" | "client") => {
  const { token } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    let active = true;
    const tick = () =>
      (scope === "artist"
        ? messagingApi.listArtistConversations(token)
        : messagingApi.listClientConversations(token)
      )
        .then((data) => {
          if (active) setConversations(data);
        })
        .catch(() => {})
        .finally(() => {
          if (active) setIsLoading(false);
        });

    tick();
    const interval = setInterval(tick, LIST_POLL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [token, scope]);

  return { conversations, isLoading };
};

export const useThread = (
  scope: ThreadScope,
  token: string | null,
  id: string | null,
) => {
  const [thread, setThread] = useState<ConversationThread | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const ready = id !== null && (scope === "guest" || token !== null);

  const fetchThread = useCallback((): Promise<ConversationThread> => {
    if (scope === "guest") return messagingApi.getGuestConversation(id as string);
    if (scope === "artist")
      return messagingApi.getArtistConversation(token as string, id as string);
    return messagingApi.getClientConversation(token as string, id as string);
  }, [scope, token, id]);

  useEffect(() => {
    if (!ready) return;

    let active = true;
    const tick = () =>
      fetchThread()
        .then((t) => {
          if (active) setThread(t);
        })
        .catch(() => {})
        .finally(() => {
          if (active) setIsLoading(false);
        });

    tick();
    void markRead(scope, token, id);
    const interval = setInterval(tick, THREAD_POLL_MS);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [ready, scope, token, id, fetchThread]);

  const send = useCallback(
    async (body: string): Promise<boolean> => {
      if (!ready) return false;
      setIsSending(true);
      try {
        if (scope === "guest") await messagingApi.sendGuestMessage(id as string, body);
        else if (scope === "artist")
          await messagingApi.sendArtistMessage(token as string, id as string, body);
        else await messagingApi.sendClientMessage(token as string, id as string, body);

        setThread(await fetchThread());
        return true;
      } catch {
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [ready, scope, token, id, fetchThread],
  );

  return { thread, isLoading, isSending, send };
};

function markRead(
  scope: ThreadScope,
  token: string | null,
  id: string | null,
): Promise<unknown> {
  if (!id) return Promise.resolve();
  if (scope === "guest") return messagingApi.markGuestRead(id).catch(() => {});
  if (!token) return Promise.resolve();
  return (
    scope === "artist"
      ? messagingApi.markArtistRead(token, id)
      : messagingApi.markClientRead(token, id)
  ).catch(() => {});
}
