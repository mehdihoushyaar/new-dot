import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import type { User, RelationshipStatus, UpdateProfilePayload } from "@/entities/user";
import type { PaginatedPosts } from "@/entities/post";

class ProfileService {
  getByUsername(username: string) {
    return apiClient.get<User>(ENDPOINTS.AUTH.PROFILE_BY_USERNAME(username));
  }
  updateProfile(payload: UpdateProfilePayload) {
    return apiClient.patch<User>(ENDPOINTS.AUTH.PROFILE, payload);
  }
  getRelationship(username: string) {
    return apiClient.get<RelationshipStatus>(ENDPOINTS.USERS.RELATIONSHIP(username));
  }
  follow(username: string) {
    return apiClient.post(ENDPOINTS.USERS.FOLLOW(username));
  }
  unfollow(username: string) {
    return apiClient.post(ENDPOINTS.USERS.UNFOLLOW(username));
  }
  cancelFollowRequest(username: string) {
    return apiClient.post(ENDPOINTS.USERS.CANCEL_FOLLOW_REQUEST(username));
  }
  acceptFollowRequest(username: string) {
    return apiClient.post(ENDPOINTS.USERS.ACCEPT_FOLLOW_REQUEST(username));
  }
  block(username: string) {
    return apiClient.post(ENDPOINTS.USERS.BLOCK(username));
  }
  unblock(username: string) {
    return apiClient.post(ENDPOINTS.USERS.UNBLOCK(username));
  }
  mute(username: string) {
    return apiClient.post(ENDPOINTS.USERS.MUTE(username));
  }
  unmute(username: string) {
    return apiClient.post(ENDPOINTS.USERS.UNMUTE(username));
  }
  getFollowers(username: string, pageParam?: string) {
    return apiClient.get<{ results: User[]; next: string | null }>(
      pageParam ?? ENDPOINTS.USERS.FOLLOWERS(username)
    );
  }
  getFollowing(username: string, pageParam?: string) {
    return apiClient.get<{ results: User[]; next: string | null }>(
      pageParam ?? ENDPOINTS.USERS.FOLLOWING(username)
    );
  }
  getProfileDots(username: string, pageParam?: string) {
    return apiClient.get<PaginatedPosts>(pageParam ?? ENDPOINTS.USERS.PROFILE_DOTS(username));
  }
  getProfileReplies(username: string, pageParam?: string) {
    return apiClient.get<PaginatedPosts>(pageParam ?? ENDPOINTS.USERS.PROFILE_REPLIES(username));
  }
  getProfileMedia(username: string, pageParam?: string) {
    return apiClient.get<PaginatedPosts>(pageParam ?? ENDPOINTS.USERS.PROFILE_MEDIA(username));
  }
  getProfileLikes(username: string, pageParam?: string) {
    return apiClient.get<PaginatedPosts>(pageParam ?? ENDPOINTS.USERS.PROFILE_LIKES(username));
  }
}

export default new ProfileService();
