"use client";

// Next.js
import { useMemo, useState } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/messaging/Messages.module.css";

// HTML Components
import { Search } from "lucide-react";

// Components
import { InitialsAvatar } from "@/components/common/InitialsAvatar";

// Libs
import { formatFullName, formatClockTime } from "@/lib/formatters";
import type { ConversationSummary } from "@/types/messaging";

interface ConversationListProps {
  conversations: ConversationSummary[];
  scope: "artist" | "client";
  activeId: string | null;
  onSelect: (id: string) => void;
}

export const ConversationList = ({
  conversations,
  scope,
  activeId,
  onSelect,
}: ConversationListProps) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) =>
      contactName(c, scope).toLowerCase().includes(q),
    );
  }, [conversations, scope, query]);

  return (
    <div className={styles.listPane}>
      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} aria-hidden />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search contacts"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className={styles.listEmpty}>
          {conversations.length === 0 ? "No conversations yet." : "No matches."}
        </div>
      ) : (
        <ul className={styles.list}>
          {filtered.map((conversation) => {
            const name = contactName(conversation, scope);
            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  className={clsx(styles.listItem, {
                    [styles.listItemActive]: conversation.id === activeId,
                  })}
                  onClick={() => onSelect(conversation.id)}
                >
                  <InitialsAvatar name={name} seed={conversation.clientEmail} />
                  <div className={styles.listItemBody}>
                    <div className={styles.listItemTop}>
                      <span className={styles.listItemName}>{name}</span>
                      {conversation.lastMessageAt && (
                        <span className={styles.listItemTime}>
                          {formatClockTime(conversation.lastMessageAt)}
                        </span>
                      )}
                    </div>
                    <div className={styles.listItemBottom}>
                      <span className={styles.listItemPreview}>
                        {conversation.lastMessageBody || "No messages yet"}
                      </span>
                      {conversation.hasUnread && (
                        <span
                          className={styles.unreadDot}
                          aria-label="Unread"
                        />
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const contactName = (c: ConversationSummary, scope: "artist" | "client") =>
  formatFullName(
    (scope === "artist" ? c.clientName : c.artistName) || "Client",
  );
