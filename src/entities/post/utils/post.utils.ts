import type { Post } from "../types/post.types";

export function isOwnPost(post: Post, currentUserId: string): boolean {
  return post.author.id === currentUserId;
}

export function canReply(post: Post, currentUserId: string, isFollowing: boolean): boolean {
  switch (post.reply_permission) {
    case "everyone": return true;
    case "following": return isFollowing || isOwnPost(post, currentUserId);
    case "mentioned": return isOwnPost(post, currentUserId);
    case "none": return isOwnPost(post, currentUserId);
  }
}

export function getRootPost(post: Post): Post {
  return post.reply_to ? getRootPost(post.reply_to) : post;
}
