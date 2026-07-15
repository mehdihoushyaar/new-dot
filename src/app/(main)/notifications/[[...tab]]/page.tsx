"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Virtuoso } from "react-virtuoso";
import { useNotifications } from "@/features/notifications/api/queries/notification.queries";
import { useMarkAllRead, useAcceptFollow, useRejectFollow } from "@/features/notifications/api/mutations/notification.mutations";
import { Avatar } from "@/shared/ui/avatar/Avatar";
import { Button } from "@/shared/ui/button/Button";
import { PostSkeleton } from "@/shared/ui/skeleton/Skeleton";
import { Spinner } from "@/shared/ui/spinner/Spinner";
import type { MappedNotification } from "@/features/notifications/api/requests/notification.requests";

type Tab = "all" | "mentions" | "follows" | "system";

export default function NotificationsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("all");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useNotifications();
  const { mutate: markAllRead } = useMarkAllRead();
  const { mutate: acceptFollow } = useAcceptFollow();
  const { mutate: rejectFollow } = useRejectFollow();

  const allNotifs = data?.pages.flatMap((p) => p.results) ?? [];
  const filtered = allNotifs.filter((n) => {
    if (tab === "all") return true;
    if (tab === "mentions") return n.type === "mention";
    if (tab === "follows") return n.type === "follow";
    if (tab === "system") return n.type === "system";
    return true;
  });

  return (
    <div>
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">{t("notifications")}</h1>
        <Button variant="ghost" size="sm" onClick={() => markAllRead()}>
          Mark all read
        </Button>
      </div>

      <div className="flex border-b border-zinc-800">
        {(["all", "mentions", "follows", "system"] as Tab[]).map((t_) => (
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

      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)
      ) : (
        <Virtuoso
          useWindowScroll
          data={filtered}
          endReached={() => hasNextPage && fetchNextPage()}
          itemContent={(_, notif: MappedNotification) => (
            <div
              key={notif.id}
              className={`flex items-start gap-3 p-4 border-b border-zinc-800 ${!notif.is_read ? "bg-sky-500/5" : ""}`}
            >
              <Avatar src={notif.actor.avatar} alt={notif.actor.display_name} size="sm" />
              <div className="flex-1">
                <p className="text-sm text-zinc-200">
                  <strong className="text-white">{notif.actor.display_name}</strong>{" "}
                  {notif.label}
                </p>
                {notif.type === "follow" && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={() => acceptFollow(notif.id)}>Accept</Button>
                    <Button size="sm" variant="ghost" onClick={() => rejectFollow(notif.id)}>Reject</Button>
                  </div>
                )}
              </div>
            </div>
          )}
          components={{
            Footer: () =>
              isFetchingNextPage ? (
                <div className="flex justify-center py-4"><Spinner /></div>
              ) : null,
          }}
        />
      )}
    </div>
  );
}
