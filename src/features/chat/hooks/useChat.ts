"use client";
import { useEffect, useRef } from "react";
import socketClient from "@/services/websocket/socket-client";
import { useChatStore } from "@/store/chat.store";
import type { ConversationSummary, UiMessage } from "@/store/chat.store";

export function useChatSocket() {
  const {
    setConversations,
    upsertConversation,
    appendMessage,
    updateMessage,
    deleteMessage,
    setUserOnline,
    setUserOffline,
    setConnectionStatus,
  } = useChatStore();

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    socketClient.connect();
    setConnectionStatus("connecting");

    socketClient.on("connect", () => setConnectionStatus("connected"));
    socketClient.on("disconnect", () => setConnectionStatus("disconnect"));
    socketClient.on("reconnecting", () => setConnectionStatus("reconnecting"));

    socketClient.on<ConversationSummary[]>("conversation.summaries", setConversations);
    socketClient.on<ConversationSummary>("conversation.summary.updated", upsertConversation);

    socketClient.on<UiMessage>("message.new", (msg) => appendMessage(msg.conversation_id, msg));
    socketClient.on<{ id: string; conversation_id: string }>("message.delete", ({ id, conversation_id }) =>
      deleteMessage(conversation_id, id)
    );
    socketClient.on<UiMessage>("message.edited", (msg) =>
      updateMessage(msg.conversation_id, msg.id, { content: msg.content, edited_at: msg.edited_at })
    );
    socketClient.on<{ user_id: string }>("user.online", ({ user_id }) => setUserOnline(user_id));
    socketClient.on<{ user_id: string }>("user.offline", ({ user_id }) => setUserOffline(user_id));

    return () => {
      ["connect", "disconnect", "reconnecting", "conversation.summaries",
       "conversation.summary.updated", "message.new", "message.delete",
       "message.edited", "user.online", "user.offline"].forEach((e) => socketClient.off(e));
    };
  }, []);
}

export function useTypingIndicator(convId: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emitTyping = () => {
    socketClient.emit("typing.start", { conversation_id: convId });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      socketClient.emit("typing.stop", { conversation_id: convId });
    }, 2000);
  };

  return { emitTyping };
}

export function useOpenPrivateChat() {
  const { setSelectedConversation, conversations } = useChatStore();

  return async (userId: string) => {
    const existing = Object.values(conversations).find(
      (c) => !c.is_group && c.participants.includes(userId)
    );
    if (existing) {
      setSelectedConversation(existing);
      return;
    }
    const { default: chatService } = await import("../api/requests/chat.requests");
    const { data } = await chatService.createConversation([userId]);
    setSelectedConversation(data);
  };
}
