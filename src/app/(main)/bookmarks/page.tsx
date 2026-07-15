"use client";
import { useTranslation } from "react-i18next";
import { Virtuoso } from "react-virtuoso";
import { useBookmarks } from "@/features/posts/api/queries/post.queries";
import { PostCard } from "@/entities/post/ui/PostCard";
import { PostSkeleton } from "@/shared/ui/skeleton/Skeleton";
import { Spinner } from "@/shared/ui/spinner/Spinner";

export default function BookmarksPage() {
  const { t } = useTranslation();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useBookmarks();
  const posts = data?.pages.flatMap((p) => p.results) ?? [];

  return (
    <div>
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-zinc-800 px-4 py-3">
        <h1 className="text-xl font-bold text-white">{t("bookmarks")}</h1>
      </div>
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)
        : (
          <Virtuoso
            useWindowScroll
            data={posts}
            endReached={() => hasNextPage && fetchNextPage()}
            itemContent={(_, post) => <PostCard key={post.id} post={post} />}
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
