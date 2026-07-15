import type { QueryClient, InfiniteData } from "@tanstack/react-query";
import type { Post, PaginatedPosts } from "@/entities/post";
import { homeTimelineKeys } from "../post.query-keys";

type PostUpdater = (post: Post) => Post;

export function patchHomeTimelinePost(qc: QueryClient, postId: string, updater: PostUpdater) {
  qc.setQueriesData<InfiniteData<PaginatedPosts>>(
    { queryKey: homeTimelineKeys.lists() },
    (data) => {
      if (!data) return data;
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          results: page.results.map((post) => patchPostAndNestedRefs(post, postId, updater)),
        })),
      };
    }
  );
}

export function patchPostAndNestedRefs(post: Post, postId: string, updater: PostUpdater): Post {
  const patched = post.id === postId ? updater(post) : post;
  return {
    ...patched,
    reply_to: patched.reply_to ? patchPostAndNestedRefs(patched.reply_to, postId, updater) : null,
    repost_of: patched.repost_of ? patchPostAndNestedRefs(patched.repost_of, postId, updater) : null,
    quote_of: patched.quote_of ? patchPostAndNestedRefs(patched.quote_of, postId, updater) : null,
  };
}

export function optimisticLikeHomeTimeline(qc: QueryClient, postId: string, liked: boolean) {
  patchHomeTimelinePost(qc, postId, (p) => ({
    ...p,
    is_liked: liked,
    like_count: p.like_count + (liked ? 1 : -1),
  }));
}

export function optimisticBookmarkHomeTimeline(qc: QueryClient, postId: string, bookmarked: boolean) {
  patchHomeTimelinePost(qc, postId, (p) => ({
    ...p,
    is_bookmarked: bookmarked,
    bookmark_count: p.bookmark_count + (bookmarked ? 1 : -1),
  }));
}

export function optimisticRepostHomeTimeline(qc: QueryClient, postId: string, reposted: boolean) {
  patchHomeTimelinePost(qc, postId, (p) => ({
    ...p,
    is_reposted: reposted,
    repost_count: p.repost_count + (reposted ? 1 : -1),
  }));
}

export function applyCreatedReplyToHomeTimeline(qc: QueryClient, parentId: string) {
  patchHomeTimelinePost(qc, parentId, (p) => ({ ...p, reply_count: p.reply_count + 1 }));
}

export function applyCreatedRepostToHomeTimeline(qc: QueryClient, post: Post) {
  qc.setQueriesData<InfiniteData<PaginatedPosts>>(
    { queryKey: homeTimelineKeys.list("for-you") },
    (data) => {
      if (!data) return data;
      const [first, ...rest] = data.pages;
      return { ...data, pages: [{ ...first, results: [post, ...first.results] }, ...rest] };
    }
  );
}

export const applyCreatedQuoteToHomeTimeline = applyCreatedRepostToHomeTimeline;

export function removePostFromHomeTimeline(qc: QueryClient, postId: string) {
  qc.setQueriesData<InfiniteData<PaginatedPosts>>(
    { queryKey: homeTimelineKeys.lists() },
    (data) => {
      if (!data) return data;
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          results: page.results.filter((p) => p.id !== postId),
        })),
      };
    }
  );
}

export function applyFollowStateToHomeTimeline(qc: QueryClient, username: string, isFollowing: boolean) {
  qc.setQueriesData<InfiniteData<PaginatedPosts>>(
    { queryKey: homeTimelineKeys.lists() },
    (data) => {
      if (!data) return data;
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          results: isFollowing
            ? page.results.map((p) =>
                p.author.username === username
                  ? { ...p, author: { ...p.author, is_following: true } }
                  : p
              )
            : page.results.filter((p) => p.author.username !== username),
        })),
      };
    }
  );
}

export function applyBlockStateToHomeTimeline(qc: QueryClient, username: string) {
  qc.setQueriesData<InfiniteData<PaginatedPosts>>(
    { queryKey: homeTimelineKeys.lists() },
    (data) => {
      if (!data) return data;
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          results: page.results.filter((p) => p.author.username !== username),
        })),
      };
    }
  );
}

export function applyMuteStateToHomeTimeline(qc: QueryClient, username: string, isMuted: boolean) {
  qc.setQueriesData<InfiniteData<PaginatedPosts>>(
    { queryKey: homeTimelineKeys.lists() },
    (data) => {
      if (!data) return data;
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          results: page.results.map((p) =>
            p.author.username === username
              ? { ...p, author: { ...p.author, is_muted: isMuted } }
              : p
          ),
        })),
      };
    }
  );
}

export function applyDonateStateToHomeTimeline(qc: QueryClient, postId: string, amount: number) {
  patchHomeTimelinePost(qc, postId, (p) => ({
    ...p,
    donate_count: ((p as Post & { donate_count?: number }).donate_count ?? 0) + amount,
  }));
}
