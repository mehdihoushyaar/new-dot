export type DotType = "dot" | "reply" | "repost" | "quote";
export type ReplyPermission = "everyone" | "following" | "mentioned" | "none";

export interface PostAuthor {
  id: string;
  username: string;
  display_name: string;
  avatar: string | null;
  is_verified: boolean;
  is_following: boolean;
  is_muted: boolean;
  is_blocked: boolean;
}

export interface Post {
  id: string;
  type: DotType;
  author: PostAuthor;
  content: string;
  media: PostMedia[];
  like_count: number;
  reply_count: number;
  repost_count: number;
  quote_count: number;
  bookmark_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  is_reposted: boolean;
  reply_permission: ReplyPermission;
  reply_to: Post | null;
  repost_of: Post | null;
  quote_of: Post | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface PostMedia {
  id: string;
  url: string;
  type: "image" | "video" | "gif";
  width: number;
  height: number;
  thumbnail_url: string | null;
}

export interface PaginatedPosts {
  results: Post[];
  next: string | null;
  previous: string | null;
  count: number;
}

export interface CreatePostPayload {
  content: string;
  type: DotType;
  media_ids?: string[];
  reply_to?: string;
  quote_of?: string;
  reply_permission?: ReplyPermission;
}
