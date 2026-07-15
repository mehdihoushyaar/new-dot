"use client";
import { useState, useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import { useChatStore } from "@/store/chat.store";
import { useChatSocket, useTypingIndicator } from "@/features/chat/hooks/useChat";
import { Avatar } from "@/shared/ui/avatar/Avatar";
import { Button } from "@/shared/ui/button/Button";
import chatService from "@/features/chat/api/requests/chat.requests";
import { useAuthFlowStore } from "@/store/auth.store";

export function ChatPanel() {
  useChatSocket();

  const {
    conversations,
    messages,
    selectedConversation,
    setSelectedConversation,
    appendTempMessage,
    replaceTempMessage,
    updateMessage,
  } = useChatStore();
  const user = useAuthFlowStore((s) => s.user);
  const [input, setInput] = useState("");
  const convList = Object.values(conversations).sort(
    (a, b) => new Date(b.last_message_at ?? 0).getTime() - new Date(a.last_message_at ?? 0).getTime()
  );

  const { emitTyping } = useTypingIndicator(selectedConversation?.id ?? "");

  const sendMessage = async () => {
    if (!input.trim() || !selectedConversation || !user) return;
    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      id: tempId,
      temp_id: tempId,
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      content: input,
      media: null,
      status: "sending" as const,
      created_at: new Date().toISOString(),
      edited_at: null,
      is_deleted: false,
      reply_to_id: null,
    };
    appendTempMessage(selectedConversation.id, tempMsg);
    setInput("");
    try {
      const { data } = await chatService.sendMessage(selectedConversation.id, { content: input });
      replaceTempMessage(selectedConversation.id, tempId, data);
    } catch {
      updateMessage(selectedConversation.id, tempId, { status: "failed" });
    }
  };

  if (!selectedConversation) {
    return (
      <div className="flex h-full">
        <div className="w-80 border-r border-zinc-800 overflow-y-auto">
          {convList.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800 transition-colors text-left"
            >
              <Avatar src={conv.avatar} alt={conv.name ?? "Chat"} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{conv.name}</p>
                <p className="text-xs text-zinc-500 truncate">{conv.last_message}</p>
              </div>
              {conv.unread_count > 0 && (
                <span className="h-5 w-5 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center">
                  {conv.unread_count}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center text-zinc-500">
          Select a conversation
        </div>
      </div>
    );
  }

  const convMessages = messages[selectedConversation.id] ?? [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
        <button onClick={() => setSelectedConversation(null)} className="text-zinc-400 hover:text-white">
          ←
        </button>
        <Avatar src={selectedConversation.avatar} alt={selectedConversation.name ?? "Chat"} size="sm" />
        <p className="font-semibold text-white">{selectedConversation.name}</p>
      </div>

      <div className="flex-1 overflow-hidden">
        <Virtuoso
          data={convMessages}
          followOutput="smooth"
          itemContent={(_, msg) => (
            <div
              key={msg.id}
              className={`flex px-4 py-1 ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-3 py-2 text-sm ${
                  msg.sender_id === user?.id
                    ? "bg-sky-500 text-white"
                    : "bg-zinc-800 text-zinc-100"
                } ${msg.status === "sending" ? "opacity-60" : ""} ${msg.status === "failed" ? "border border-red-500" : ""}`}
              >
                {msg.is_deleted ? (
                  <span className="italic text-zinc-400">Message deleted</span>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          )}
        />
      </div>

      <div className="flex items-center gap-2 p-4 border-t border-zinc-800">
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); emitTyping(); }}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-800 rounded-full px-4 py-2 text-sm text-white outline-none placeholder-zinc-500"
        />
        <Button size="sm" onClick={sendMessage} disabled={!input.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
