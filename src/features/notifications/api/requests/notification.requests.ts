import { apiClient } from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";

export type NotificationType = "like" | "reply" | "repost" | "quote" | "follow" | "mention" | "system";

export interface ApiNotification {
  id: string;
  type: NotificationType;
  actor: { id: string; username: string; display_name: string; avatar: string | null };
  post_id: string | null;
  is_read: boolean;
  created_at: string;
  meta: Record<string, unknown>;
}

export interface MappedNotification extends ApiNotification {
  label: string;
}

export function mapNotification(n: ApiNotification): MappedNotification {
  const labels: Record<NotificationType, string> = {
    like: "liked your dot",
    reply: "replied to your dot",
    repost: "reposted your dot",
    quote: "quoted your dot",
    follow: "followed you",
    mention: "mentioned you",
    system: "system notification",
  };
  return { ...n, label: labels[n.type] };
}

class NotificationService {
  getList(pageParam?: string) {
    return apiClient.get<{ results: ApiNotification[]; next: string | null }>(
      pageParam ?? ENDPOINTS.NOTIFICATIONS.LIST
    );
  }
  markRead(id: string) {
    return apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  }
  markAllRead() {
    return apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  }
  getPreferences() {
    return apiClient.get(ENDPOINTS.NOTIFICATIONS.PREFERENCES);
  }
  updatePreferences(payload: Record<string, boolean>) {
    return apiClient.patch(ENDPOINTS.NOTIFICATIONS.PREFERENCES, payload);
  }
  acceptFollow(id: string) {
    return apiClient.post(ENDPOINTS.NOTIFICATIONS.ACCEPT_FOLLOW(id));
  }
  rejectFollow(id: string) {
    return apiClient.post(ENDPOINTS.NOTIFICATIONS.REJECT_FOLLOW(id));
  }
}

export default new NotificationService();
