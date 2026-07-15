"use client";
import { useTranslation } from "react-i18next";
import { usePostDetail } from "@/features/posts/api/queries/post.queries";
import { usePostReplies } from "@/features/posts/api/queries/post.queries";
import { PostCard } from "@/entities/post/ui/PostCard";
import { PostComposer } from "@/features/posts/ui/PostComposer";
import { PostSkeleton } from "@/shared/ui/skeleton/Skeleton";
import { Spinner } from "@/shared/ui/spinner/Spinner";
import { Virtuoso } from "react-virtuoso";

interface Props {
  postId: string;
}

export function PostDetail({ postId }: Props) {
  const { t } = useTranslation();
  const { data: post, isLoading } = usePostDetail(postId);
  const { data: repliesData, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePostReplies(postId);

  const replies = repliesData?.pages.flatMap((p) => p.results) ?? [];

  if (isLoading) return <PostSkeleton />;
  if (!post) return <p className="p-4 text-zinc-500">{t("error")}</p>;

  return (
    <div>
      {post.reply_to && (
        <div className="opacity-70">
          <PostCard post={post.reply_to} />
        </div>
      )}
      <PostCard post={post} />
      <PostComposer type="reply" replyTo={post} />
      <Virtuoso
        useWindowScroll
        data={replies}
        endReached={() => hasNextPage && fetchNextPage()}
        itemContent={(_, reply) => <PostCard key={reply.id} post={reply} />}
        components={{
          Footer: () =>
            isFetchingNextPage ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : null,
        }}
      />
    </div>
  );
}
