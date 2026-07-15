export type KycStatus = "none" | "pending" | "approved" | "rejected";

export interface User {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar: string | null;
  header_image: string | null;
  is_verified: boolean;
  is_private: boolean;
  follower_count: number;
  following_count: number;
  dot_count: number;
  kyc_status: KycStatus;
  two_fa_enabled: boolean;
  auto_play_media: boolean;
  created_at: string;
}

export interface RelationshipStatus {
  is_following: boolean;
  is_followed_by: boolean;
  is_blocked: boolean;
  is_muted: boolean;
  follow_request_sent: boolean;
  follow_request_received: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface UpdateProfilePayload {
  display_name?: string;
  bio?: string;
  is_private?: boolean;
  auto_play_media?: boolean;
}
