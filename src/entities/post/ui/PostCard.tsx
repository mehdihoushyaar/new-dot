"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { Post } from "../types/post.types";
import { Avatar } from "@/shared/ui/avatar/Avatar";
import { useLikePost, useBookmarkPost, useRepost } from "@/features/posts/api/mutations/post.mutations";
import { ROUTES } from "@/config/routes";

interface Props {
  post: Post;
}

export function PostCard({ post }: Props) {
  const { t } = useTranslation();
  const { mutate: likePost } = useLikePost();
  const { mutate: bookmarkPost } = useBookmarkPost();
  const { mutate: repost } = useRepost();

  const displayPost = post.type === "repost" && post.repost_of ? post.repost_of : post;

  return (
    <article className="border-b border-zinc-800 p-4 hover:bg-zinc-900/50 transition-colors">
      {post.type === "repost" && (
        <p className="mb-1 text-xs text-zinc-500 pl-12">
          🔁 {post.author.display_name} reposted
        </p>
      )}
      <div className="flex gap-3">
        <Link href={ROUTES.PROFILE(displayPost.author.username)} className="shrink-0">
          <Avatar src={displayPost.author.avatar} alt={displayPost.author.display_name} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <Link
              href={ROUTES.PROFILE(displayPost.author.username)}
              className="font-semibold text-white hover:underline truncate"
            >
              {displayPost.author.display_name}
            </Link>
            <span className="text-zinc-500 text-sm truncate">@{displayPost.author.username}</span>
          </div>

          <Link href={ROUTES.POST(displayPost.author.username, displayPost.id)}>
            <p className="mt-1 text-sm text-zinc-100 whitespace-pre-wrap break-words">
              {displayPost.content}
            </p>
          </Link>

          {displayPost.media.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
              {displayPost.media.slice(0, 4).map((m) => (
                <img
                  key={m.id}
                  src={m.url}
                  alt=""
                  loading="lazy"
                  className="w-full object-cover aspect-video"
                />
              ))}
            </div>
          )}

          {displayPost.quote_of && (
            <div className="mt-2 rounded-xl border border-zinc-700 p-3">
              <p className="text-xs text-zinc-400 font-semibold">
                @{displayPost.quote_of.author.username}
              </p>
              <p className="text-sm text-zinc-300 mt-1">{displayPost.quote_of.content}</p>
            </div>
          )}

          <div className="mt-3 flex items-center gap-5 text-zinc-500 text-sm">
            <button
              className="flex items-center gap-1 hover:text-sky-400 transition-colors"
              aria-label={t("reply")}
            >
              💬 {displayPost.reply_count}
            </button>
            <button
              onClick={() => repost({ id: displayPost.id, reposted: !displayPost.is_reposted })}
              className={`flex items-center gap-1 transition-colors ${displayPost.is_reposted ? "text-green-400" : "hover:text-green-400"}`}
              aria-label={t("repost")}
            >
              🔁 {displayPost.repost_count}
            </button>
            <button
              onClick={() => likePost({ id: displayPost.id, liked: !displayPost.is_liked })}
              className={`flex items-center gap-1 transition-colors ${displayPost.is_liked ? "text-red-400" : "hover:text-red-400"}`}
              aria-label={t("like")}
            >
              {displayPost.is_liked ? "❤️" : "🤍"} {displayPost.like_count}
            </button>
            <button
              onClick={() => bookmarkPost({ id: displayPost.id, bookmarked: !displayPost.is_bookmarked })}
              className={`flex items-center gap-1 transition-colors ${displayPost.is_bookmarked ? "text-sky-400" : "hover:text-sky-400"}`}
              aria-label={t("bookmark")}
            >
              {displayPost.is_bookmarked ? "🔖" : "📄"} {displayPost.bookmark_count}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
