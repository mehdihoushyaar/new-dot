import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { Post, PaginatedPosts, CreatePostPayload } from "@/entities/post";

class PostService {
  getFeed(tab: "for-you" | "following", pageParam?: string) {
    const url = tab === "for-you" ? ENDPOINTS.FEED.FOR_YOU : ENDPOINTS.FEED.FOLLOWING;
    return apiClient.get<PaginatedPosts>(pageParam ?? url);
  }
  getPost(id: string) {
    return apiClient.get<Post>(ENDPOINTS.POSTS.DETAIL(id));
  }
  getReplies(id: string, pageParam?: string) {
    return apiClient.get<PaginatedPosts>(pageParam ?? ENDPOINTS.POSTS.REPLIES(id));
  }
  createPost(payload: CreatePostPayload) {
    return apiClient.post<Post>(ENDPOINTS.POSTS.CREATE, payload);
  }
  deletePost(id: string) {
    return apiClient.delete(ENDPOINTS.POSTS.DELETE(id));
  }
  likePost(id: string) {
    return apiClient.post(ENDPOINTS.POSTS.LIKE(id));
  }
  unlikePost(id: string) {
    return apiClient.delete(ENDPOINTS.POSTS.LIKE(id));
  }
  bookmarkPost(id: string) {
    return apiClient.post(ENDPOINTS.POSTS.BOOKMARK(id));
  }
  unbookmarkPost(id: string) {
    return apiClient.delete(ENDPOINTS.POSTS.BOOKMARK(id));
  }
  repost(id: string) {
    return apiClient.post(ENDPOINTS.POSTS.REPOST(id));
  }
  unrepost(id: string) {
    return apiClient.delete(ENDPOINTS.POSTS.REPOST(id));
  }
  reportPost(id: string, reason: string) {
    return apiClient.post(ENDPOINTS.POSTS.REPORT(id), { reason });
  }
  getBookmarks(pageParam?: string) {
    return apiClient.get<PaginatedPosts>(pageParam ?? ENDPOINTS.BOOKMARKS.LIST);
  }
  getDrafts() {
    return apiClient.get<PaginatedPosts>(ENDPOINTS.POSTS.DRAFTS);
  }
}

export default new PostService();
