// Libs
import { api } from "@/lib/api/client";
import type {
  ConversationSummary,
  ConversationThread,
  MessageView,
} from "@/types/messaging";

type Ack = { ok: boolean };

export const messagingApi = {
  listArtistConversations: (token: string) =>
    api.get<ConversationSummary[]>("/v1/current-user/conversations", token),
  getArtistConversation: (token: string, id: string) =>
    api.get<ConversationThread>(`/v1/current-user/conversations/${id}`, token),
  sendArtistMessage: (token: string, id: string, body: string) =>
    api.post<MessageView>(
      `/v1/current-user/conversations/${id}/messages`,
      { body },
      token,
    ),
  markArtistRead: (token: string, id: string) =>
    api.post<Ack>(`/v1/current-user/conversations/${id}/read`, {}, token),

  listClientConversations: (token: string) =>
    api.get<ConversationSummary[]>(
      "/v1/current-user/client/conversations",
      token,
    ),
  getClientConversation: (token: string, id: string) =>
    api.get<ConversationThread>(
      `/v1/current-user/client/conversations/${id}`,
      token,
    ),
  sendClientMessage: (token: string, id: string, body: string) =>
    api.post<MessageView>(
      `/v1/current-user/client/conversations/${id}/messages`,
      { body },
      token,
    ),
  markClientRead: (token: string, id: string) =>
    api.post<Ack>(`/v1/current-user/client/conversations/${id}/read`, {}, token),

  getGuestConversation: (accessToken: string) =>
    api.get<ConversationThread>(`/v1/conversations/by-token/${accessToken}`),
  sendGuestMessage: (accessToken: string, body: string) =>
    api.post<MessageView>(`/v1/conversations/by-token/${accessToken}/messages`, {
      body,
    }),
  markGuestRead: (accessToken: string) =>
    api.post<Ack>(`/v1/conversations/by-token/${accessToken}/read`, {}),
};
