import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import notificationService, { mapNotification } from "../requests/notification.requests";
import { notificationKeys } from "../../notification.query-keys";

export function useNotifications() {
  return useInfiniteQuery({
    queryKey: notificationKeys.lists(),
    queryFn: ({ pageParam }) =>
      notificationService
        .getList(pageParam as string | undefined)
        .then((r) => ({ ...r.data, results: r.data.results.map(mapNotification) })),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (p) => p.next ?? undefined,
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: () => notificationService.getPreferences().then((r) => r.data),
  });
}
