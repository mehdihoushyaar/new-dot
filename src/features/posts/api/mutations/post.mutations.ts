import { useMutation, useQueryClient } from "@tanstack/react-query";
import postService from "../requests/post.requests";
import { postKeys } from "../../post.query-keys";
import {
  optimisticLikeHomeTimeline,
  optimisticBookmarkHomeTimeline,
  optimisticRepostHomeTimeline,
  removePostFromHomeTimeline,
  applyCreatedReplyToHomeTimeline,
  applyCreatedRepostToHomeTimeline,
  applyCreatedQuoteToHomeTimeline,
} from "../../logic/timeline.patchers";
import type { CreatePostPayload } from "@/entities/post";

export function useLikePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, liked }: { id: string; liked: boolean }) =>
      liked ? postService.likePost(id) : postService.unlikePost(id),
    onMutate: ({ id, liked }) => optimisticLikeHomeTimeline(qc, id, liked),
    onError: (_e, { id, liked }) => optimisticLikeHomeTimeline(qc, id, !liked),
  });
}

export function useBookmarkPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, bookmarked }: { id: string; bookmarked: boolean }) =>
      bookmarked ? postService.bookmarkPost(id) : postService.unbookmarkPost(id),
    onMutate: ({ id, bookmarked }) => optimisticBookmarkHomeTimeline(qc, id, bookmarked),
    onError: (_e, { id, bookmarked }) => optimisticBookmarkHomeTimeline(qc, id, !bookmarked),
  });
}

export function useRepost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reposted }: { id: string; reposted: boolean }) =>
      reposted ? postService.repost(id) : postService.unrepost(id),
    onMutate: ({ id, reposted }) => optimisticRepostHomeTimeline(qc, id, reposted),
    onError: (_e, { id, reposted }) => optimisticRepostHomeTimeline(qc, id, !reposted),
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postService.createPost(payload).then((r) => r.data),
    onSuccess: (post) => {
      if (post.type === "reply" && post.reply_to) {
        applyCreatedReplyToHomeTimeline(qc, post.reply_to.id);
        qc.invalidateQueries({ queryKey: postKeys.replies(post.reply_to.id) });
      } else if (post.type === "repost") {
        applyCreatedRepostToHomeTimeline(qc, post);
      } else if (post.type === "quote") {
        applyCreatedQuoteToHomeTimeline(qc, post);
      } else {
        qc.invalidateQueries({ queryKey: postKeys.all });
      }
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => postService.deletePost(id),
    onSuccess: (_data, id) => removePostFromHomeTimeline(qc, id),
  });
}
