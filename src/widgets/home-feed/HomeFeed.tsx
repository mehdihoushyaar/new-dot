"use client";
import { useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import { useHomeTimeline } from "@/features/posts/api/queries/post.queries";
import { PostCard } from "@/entities/post/ui/PostCard";
import { PostSkeleton } from "@/shared/ui/skeleton/Skeleton";
import { Spinner } from "@/shared/ui/spinner/Spinner";

interface Props {
  tab: "for-you" | "following";
}

export function HomeFeed({ tab }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useHomeTimeline(tab);

  const posts = data?.pages.flatMap((p) => p.results) ?? [];

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <Virtuoso
      useWindowScroll
      data={posts}
      endReached={() => hasNextPage && fetchNextPage()}
      itemContent={(_, post) => <PostCard key={post.id} post={post} />}
      components={{
        Footer: () =>
          isFetchingNextPage ? (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          ) : null,
      }}
    />
  );
}
