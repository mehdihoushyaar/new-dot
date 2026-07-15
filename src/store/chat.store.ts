import { create } from "zustand";

export type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnect";

export interface ConversationSummary {
  id: string;
  name: string | null;
  avatar: string | null;
  is_group: boolean;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  is_muted: boolean;
  is_blocked: boolean;
  participants: string[];
}

export interface UiMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  media: string | null;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  created_at: string;
  edited_at: string | null;
  is_deleted: boolean;
  reply_to_id: string | null;
  temp_id?: string;
}

export interface Member {
  id: string;
  username: string;
  display_name: string;
  avatar: string | null;
  is_online: boolean;
}

export interface PinnedMessage {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface ChatState {
  conversations: Record<string, ConversationSummary>;
  messages: Record<string, UiMessage[]>;
  members: Record<string, Member[]>;
  pinnedMessages: Record<string, PinnedMessage[]>;
  selectedConversation: ConversationSummary | null;
  onlineUsers: string[];
  connectionStatus: ConnectionStatus;
  showChat: boolean;

  setConversations: (convs: ConversationSummary[]) => void;
  upsertConversation: (conv: ConversationSummary) => void;
  setMessages: (convId: string, msgs: UiMessage[]) => void;
  appendMessage: (convId: string, msg: UiMessage) => void;
  appendTempMessage: (convId: string, msg: UiMessage) => void;
  replaceTempMessage: (convId: string, tempId: string, msg: UiMessage) => void;
  updateMessage: (convId: string, msgId: string, patch: Partial<UiMessage>) => void;
  deleteMessage: (convId: string, msgId: string) => void;
  setMembers: (convId: string, members: Member[]) => void;
  setPinnedMessages: (convId: string, msgs: PinnedMessage[]) => void;
  setSelectedConversation: (conv: ConversationSummary | null) => void;
  setOnlineUsers: (users: string[]) => void;
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setShowChat: (show: boolean) => void;
  resetChatState: () => void;
}

const initialState = {
  conversations: {},
  messages: {},
  members: {},
  pinnedMessages: {},
  selectedConversation: null,
  onlineUsers: [],
  connectionStatus: "disconnect" as ConnectionStatus,
  showChat: false,
};

export const useChatStore = create<ChatState>()((set) => ({
  ...initialState,

  setConversations: (convs) =>
    set({ conversations: Object.fromEntries(convs.map((c) => [c.id, c])) }),

  upsertConversation: (conv) =>
    set((s) => ({ conversations: { ...s.conversations, [conv.id]: conv } })),

  setMessages: (convId, msgs) =>
    set((s) => ({ messages: { ...s.messages, [convId]: msgs } })),

  appendMessage: (convId, msg) =>
    set((s) => ({ messages: { ...s.messages, [convId]: [...(s.messages[convId] ?? []), msg] } })),

  appendTempMessage: (convId, msg) =>
    set((s) => ({ messages: { ...s.messages, [convId]: [...(s.messages[convId] ?? []), msg] } })),

  replaceTempMessage: (convId, tempId, msg) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [convId]: (s.messages[convId] ?? []).map((m) => (m.temp_id === tempId ? msg : m)),
      },
    })),

  updateMessage: (convId, msgId, patch) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [convId]: (s.messages[convId] ?? []).map((m) => (m.id === msgId ? { ...m, ...patch } : m)),
      },
    })),

  deleteMessage: (convId, msgId) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [convId]: (s.messages[convId] ?? []).map((m) =>
          m.id === msgId ? { ...m, is_deleted: true } : m
        ),
      },
    })),

  setMembers: (convId, members) =>
    set((s) => ({ members: { ...s.members, [convId]: members } })),

  setPinnedMessages: (convId, msgs) =>
    set((s) => ({ pinnedMessages: { ...s.pinnedMessages, [convId]: msgs } })),

  setSelectedConversation: (conv) => set({ selectedConversation: conv }),

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  setUserOnline: (userId) =>
    set((s) => ({ onlineUsers: [...new Set([...s.onlineUsers, userId])] })),

  setUserOffline: (userId) =>
    set((s) => ({ onlineUsers: s.onlineUsers.filter((id) => id !== userId) })),

  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),

  setShowChat: (showChat) => set({ showChat }),

  resetChatState: () => set(initialState),
}));

export function useTotalUnreadCount() {
  return useChatStore((s) =>
    Object.values(s.conversations).reduce((acc, c) => acc + c.unread_count, 0)
  );
}
