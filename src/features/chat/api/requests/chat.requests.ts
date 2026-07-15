import { apiClientChat } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { ConversationSummary, UiMessage, Member, PinnedMessage } from "@/store/chat.store";

class ChatService {
  getConversations() {
    return apiClientChat.get<ConversationSummary[]>(ENDPOINTS.CHAT.CONVERSATIONS);
  }
  getMessages(convId: string, pageParam?: string) {
    return apiClientChat.get<{ results: UiMessage[]; next: string | null }>(
      pageParam ?? ENDPOINTS.CHAT.MESSAGES(convId)
    );
  }
  sendMessage(convId: string, payload: { content: string; media?: string; reply_to_id?: string }) {
    return apiClientChat.post<UiMessage>(ENDPOINTS.CHAT.MESSAGES(convId), payload);
  }
  editMessage(convId: string, msgId: string, content: string) {
    return apiClientChat.patch<UiMessage>(ENDPOINTS.CHAT.MESSAGE_DETAIL(convId, msgId), { content });
  }
  deleteMessage(convId: string, msgId: string) {
    return apiClientChat.delete(ENDPOINTS.CHAT.MESSAGE_DETAIL(convId, msgId));
  }
  pinMessage(convId: string, msgId: string) {
    return apiClientChat.post(ENDPOINTS.CHAT.PIN_MESSAGE(convId, msgId));
  }
  unpinMessage(convId: string, msgId: string) {
    return apiClientChat.delete(ENDPOINTS.CHAT.PIN_MESSAGE(convId, msgId));
  }
  getPinnedMessages(convId: string) {
    return apiClientChat.get<PinnedMessage[]>(ENDPOINTS.CHAT.PINNED_MESSAGES(convId));
  }
  getMembers(convId: string) {
    return apiClientChat.get<Member[]>(ENDPOINTS.CHAT.MEMBERS(convId));
  }
  createConversation(participantIds: string[]) {
    return apiClientChat.post<ConversationSummary>(ENDPOINTS.CHAT.CONVERSATIONS, {
      participant_ids: participantIds,
    });
  }
  muteConversation(convId: string, muted: boolean) {
    return apiClientChat.patch(ENDPOINTS.CHAT.CONVERSATION_DETAIL(convId), { is_muted: muted });
  }
  deleteConversation(convId: string) {
    return apiClientChat.delete(ENDPOINTS.CHAT.CONVERSATION_DETAIL(convId));
  }
}

export default new ChatService();
