import { useMutation, useQueryClient } from "@tanstack/react-query";
import notificationService from "../requests/notification.requests";
import { notificationKeys } from "../../notification.query-keys";
import { useNotificationStore } from "@/store/notification.store";

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.lists() }),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  const { clearUnread } = useNotificationStore();
  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => {
      clearUnread();
      qc.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
}

export function useAcceptFollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.acceptFollow(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.lists() }),
  });
}

export function useRejectFollow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.rejectFollow(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.lists() }),
  });
}
