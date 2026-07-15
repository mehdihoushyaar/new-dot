import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import postService from "../requests/post.requests";
import { homeTimelineKeys, postKeys } from "../../post.query-keys";

export function useHomeTimeline(tab: "for-you" | "following") {
  return useInfiniteQuery({
    queryKey: homeTimelineKeys.list(tab),
    queryFn: ({ pageParam, signal }) =>
      postService.getFeed(tab, pageParam as string | undefined).then((r) => r.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  });
}

export function usePostDetail(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postService.getPost(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function usePostReplies(id: string) {
  return useInfiniteQuery({
    queryKey: postKeys.replies(id),
    queryFn: ({ pageParam }) =>
      postService.getReplies(id, pageParam as string | undefined).then((r) => r.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    enabled: !!id,
  });
}

export function useBookmarks() {
  return useInfiniteQuery({
    queryKey: postKeys.bookmarks(),
    queryFn: ({ pageParam }) =>
      postService.getBookmarks(pageParam as string | undefined).then((r) => r.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  });
}
