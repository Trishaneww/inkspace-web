"use client";

// Next.js
import { useState } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/messaging/Messages.module.css";

// HTML Components
import { Loader2, Mail, Phone, SendHorizontal } from "lucide-react";

// Components
import { InitialsAvatar } from "@/components/common/InitialsAvatar";

// Libs
import { formatFullName, formatClockTime, formatPhone } from "@/lib/formatters";
import type { ConversationThread, MessageSender } from "@/types/messaging";

const GROUP_WINDOW_MS = 5 * 60 * 1000;

interface MessageThreadProps {
  thread: ConversationThread | null;
  viewerType: MessageSender;
  viewerName: string;
  viewerAvatarUrl?: string;
  isSending: boolean;
  onSend: (body: string) => Promise<boolean>;
  emptyHint?: string;
}

const Avatar = ({
  name,
  seed,
  photoUrl,
}: {
  name: string;
  seed?: string;
  photoUrl?: string;
}) =>
  photoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photoUrl} alt={name} className={styles.avatarImg} />
  ) : (
    <InitialsAvatar name={name} seed={seed} />
  );

export const MessageThread = ({
  thread,
  viewerType,
  viewerName,
  viewerAvatarUrl,
  isSending,
  onSend,
  emptyHint,
}: MessageThreadProps) => {
  const [draft, setDraft] = useState("");

  const submit = async () => {
    const body = draft.trim();
    if (!body || isSending) return;
    const ok = await onSend(body);
    if (ok) setDraft("");
  };

  if (!thread) {
    return (
      <div className={styles.threadEmpty}>
        {emptyHint ?? "Select a conversation"}
      </div>
    );
  }

  const otherName = formatFullName(
    (viewerType === "artist" ? thread.clientName : thread.artistName) ||
      "Client",
  );
  const otherSeed =
    viewerType === "artist" ? thread.clientEmail : thread.artistName;
  const myName = formatFullName(viewerName || "You");

  const showContact = viewerType === "artist";
  const phone = thread.clientPhone.trim();
  const email = thread.clientEmail.trim();
  const telHref = phone.replace(/[^\d+]/g, "");

  return (
    <div className={styles.thread}>
      <div className={styles.threadHeader}>
        <InitialsAvatar name={otherName} seed={otherSeed} />
        <div className={styles.threadHeaderInfo}>
          <span className={styles.threadHeaderName}>{otherName}</span>
          {showContact && phone && (
            <span className={styles.threadHeaderPhone}>
              {formatPhone(phone)}
            </span>
          )}
        </div>

        {showContact && (
          <div className={styles.threadHeaderActions}>
            {phone && (
              <a
                href={`tel:${telHref}`}
                className={styles.headerAction}
                aria-label="Call client"
              >
                <Phone size={18} />
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className={styles.headerAction}
                aria-label="Email client"
              >
                <Mail size={18} />
              </a>
            )}
          </div>
        )}
      </div>

      <div className={styles.messages}>
        {thread.messages.length === 0 ? (
          <div className={styles.messagesEmpty}>
            No messages yet — say hello.
          </div>
        ) : (
          thread.messages.map((message, index) => {
            const mine = message.senderType === viewerType;
            const prev = thread.messages[index - 1];
            const startsGroup =
              !prev ||
              prev.senderType !== message.senderType ||
              new Date(message.createdAt).getTime() -
                new Date(prev.createdAt).getTime() >
                GROUP_WINDOW_MS;

            return (
              <div
                key={message.id}
                className={clsx(styles.messageRow, {
                  [styles.messageRowMine]: mine,
                  [styles.messageRowGrouped]: !startsGroup,
                })}
              >
                {startsGroup && (
                  <div className={styles.messageMeta}>
                    {mine ? (
                      <>
                        <span className={styles.messageTime}>
                          {formatClockTime(message.createdAt)}
                        </span>
                        <span className={styles.messageSender}>You</span>
                        <Avatar
                          name={myName}
                          seed={myName}
                          photoUrl={viewerAvatarUrl}
                        />
                      </>
                    ) : (
                      <>
                        <InitialsAvatar name={otherName} seed={otherSeed} />
                        <span className={styles.messageSender}>
                          {otherName}
                        </span>
                        <span className={styles.messageTime}>
                          {formatClockTime(message.createdAt)}
                        </span>
                      </>
                    )}
                  </div>
                )}
                <div
                  className={clsx(styles.bubble, {
                    [styles.bubbleMine]: mine,
                  })}
                >
                  {message.body}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        className={styles.composer}
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <textarea
          className={styles.composerInput}
          placeholder="Write a message…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void submit();
            }
          }}
          rows={2}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={isSending || draft.trim() === ""}
          aria-label="Send message"
        >
          {isSending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <SendHorizontal size={16} />
          )}
        </button>
      </form>
    </div>
  );
};
