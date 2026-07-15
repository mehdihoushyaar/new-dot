"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCreatePost } from "@/features/posts/api/mutations/post.mutations";
import { useAuthFlowStore } from "@/store/auth.store";
import { Avatar } from "@/shared/ui/avatar/Avatar";
import { Button } from "@/shared/ui/button/Button";
import type { DotType, Post, ReplyPermission } from "@/entities/post";

interface Props {
  type?: DotType;
  replyTo?: Post;
  quoteOf?: Post;
  onSuccess?: () => void;
}

export function PostComposer({ type = "dot", replyTo, quoteOf, onSuccess }: Props) {
  const { t } = useTranslation();
  const user = useAuthFlowStore((s) => s.user);
  const { mutate: createPost, isPending } = useCreatePost();
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createPost(
      {
        content,
        type,
        reply_permission: "everyone" as ReplyPermission,
        reply_to: replyTo?.id,
        quote_of: quoteOf?.id,
      },
      { onSuccess: () => { setContent(""); onSuccess?.(); } }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4 border-b border-zinc-800">
      <Avatar src={user?.avatar ?? null} alt={user?.display_name ?? "You"} />
      <div className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("what-on-your-mind")}
          rows={3}
          maxLength={280}
          className="w-full bg-transparent text-white placeholder-zinc-500 resize-none outline-none text-sm"
        />
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs ${content.length > 260 ? "text-red-400" : "text-zinc-500"}`}>
            {280 - content.length}
          </span>
          <Button type="submit" size="sm" loading={isPending} disabled={!content.trim()}>
            {t("post")}
          </Button>
        </div>
      </div>
    </form>
  );
}
