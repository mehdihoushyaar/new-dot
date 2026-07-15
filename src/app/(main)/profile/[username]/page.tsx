"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import { useProfileByUsername } from "@/features/profile/api/queries/profile.queries";
import { useProfileDots, useProfileReplies, useProfileMedia, useProfileLikes } from "@/features/profile/api/queries/profile.queries";
import { useRelationship } from "@/features/profile/api/queries/profile.queries";
import { useFollow, useBlock, useMute } from "@/features/profile/api/mutations/profile.mutations";
import { useAuthFlowStore } from "@/store/auth.store";
import { Avatar } from "@/shared/ui/avatar/Avatar";
import { Button } from "@/shared/ui/button/Button";
import { PostCard } from "@/entities/post/ui/PostCard";
import { PostSkeleton } from "@/shared/ui/skeleton/Skeleton";
import { Virtuoso } from "react-virtuoso";

type ProfileTab = "dots" | "replies" | "media" | "likes";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { t } = useTranslation();
  const currentUser = useAuthFlowStore((s) => s.user);
  const [tab, setTab] = useState<ProfileTab>("dots");

  const { data: profile, isLoading } = useProfileByUsername(username);
  const { data: relationship } = useRelationship(username);
  const { mutate: follow, isPending: followPending } = useFollow(username);
  const { mutate: block } = useBlock(username);
  const { mutate: mute } = useMute(username);

  const isOwn = currentUser?.username === username;

  const dotsQuery = useProfileDots(username);
  const repliesQuery = useProfileReplies(username);
  const mediaQuery = useProfileMedia(username);
  const likesQuery = useProfileLikes(username);

  const queryMap = { dots: dotsQuery, replies: repliesQuery, media: mediaQuery, likes: likesQuery };
  const activeQuery = queryMap[tab];
  const posts = activeQuery.data?.pages.flatMap((p) => p.results) ?? [];

  if (isLoading) return <PostSkeleton />;
  if (!profile) return <p className="p-4 text-zinc-500">{t("error")}</p>;

  return (
    <div>
      <div className="relative">
        {profile.header_image ? (
          <img src={profile.header_image} alt="" className="w-full h-40 object-cover" />
        ) : (
          <div className="w-full h-40 bg-zinc-800" />
        )}
        <div className="absolute -bottom-12 left-4">
          <Avatar src={profile.avatar} alt={profile.display_name} size="xl" className="ring-4 ring-black" />
        </div>
      </div>

      <div className="pt-14 px-4 pb-4 border-b border-zinc-800">
        <div className="flex justify-end gap-2 mb-3">
          {!isOwn && relationship && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => mute({ mute: !relationship.is_muted })}
              >
                {relationship.is_muted ? "Unmute" : "Mute"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => block({ block: !relationship.is_blocked })}
              >
                {relationship.is_blocked ? "Unblock" : "Block"}
              </Button>
              <Button
                size="sm"
                variant={relationship.is_following ? "secondary" : "primary"}
                loading={followPending}
                onClick={() => follow({ follow: !relationship.is_following })}
              >
                {relationship.is_following ? t("unfollow") : t("follow")}
              </Button>
            </>
          )}
        </div>

        <h1 className="text-xl font-bold text-white">{profile.display_name}</h1>
        <p className="text-zinc-500 text-sm">@{profile.username}</p>
        {profile.bio && <p className="mt-2 text-sm text-zinc-300">{profile.bio}</p>}
        <div className="flex gap-4 mt-3 text-sm text-zinc-500">
          <span><strong className="text-white">{profile.following_count}</strong> Following</span>
          <span><strong className="text-white">{profile.follower_count}</strong> Followers</span>
        </div>
      </div>

      <div className="flex border-b border-zinc-800">
        {(["dots", "replies", "media", "likes"] as ProfileTab[]).map((t_) => (
          <button
            key={t_}
            onClick={() => setTab(t_)}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
              tab === t_ ? "text-white border-b-2 border-sky-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t_}
          </button>
        ))}
      </div>

      {activeQuery.isLoading ? (
        Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
      ) : (
        <Virtuoso
          useWindowScroll
          data={posts}
          endReached={() => activeQuery.hasNextPage && activeQuery.fetchNextPage()}
          itemContent={(_, post) => <PostCard key={post.id} post={post} />}
        />
      )}
    </div>
  );
}
