export type MessageSender = "artist" | "client" | "system";

export interface ConversationSummary {
  id: string;
  bookingRequestId: string;
  clientName: string;
  clientEmail: string;
  artistName: string;
  status: string;
  lastMessageBody: string;
  lastMessageAt: string | null;
  hasUnread: boolean;
}

export interface MessageView {
  id: string;
  senderType: MessageSender;
  body: string;
  aiDrafted: boolean;
  createdAt: string;
}

export interface ConversationThread {
  id: string;
  bookingRequestId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  artistName: string;
  status: string;
  messages: MessageView[];
}
