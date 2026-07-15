import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import authService, { type LoginResponse } from "../../api/requests/auth.requests";
import { authKeys } from "../../auth.query-keys";
import { useAuthFlowStore, useAuthUiFlow } from "@/store/auth.store";
import { useCurrentProfileStore, useProfileStore } from "@/store/profile.store";
import { useChatStore } from "@/store/chat.store";
import socketClient from "@/services/websocket/socket-client";
import { ROUTES } from "@/config/routes";
import type { User } from "@/entities/user";
import type { AxiosResponse } from "axios";

export function useLogin() {
  const { startFlow } = useAuthUiFlow();
  const { setLoggedIn } = useAuthFlowStore();
  return useMutation({
    mutationFn: (payload: { username: string; password: string }) => authService.login(payload),
    onSuccess: (res: AxiosResponse<LoginResponse>) => {
      if (res.data.requires_2fa) {
        startFlow("2fa-setup");
      } else if (res.data.user) {
        setLoggedIn(res.data.user);
      }
    },
  });
}

export function useVerify2Fa() {
  const { setLoggedIn } = useAuthFlowStore();
  return useMutation({
    mutationFn: (payload: { otp: string }) => authService.verify2Fa(payload),
    onSuccess: (res: AxiosResponse<{ user: User }>) => setLoggedIn(res.data.user),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const router = useRouter();
  const { logout } = useAuthFlowStore();
  const { resetFlow } = useAuthUiFlow();
  const { clearAll: clearProfile } = useProfileStore();
  const { clearAll: clearCurrentProfile } = useCurrentProfileStore();
  const { resetChatState } = useChatStore();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      socketClient.disconnect();
      resetChatState();
      qc.clear();
      localStorage.removeItem("auth-storage");
      resetFlow();
      clearProfile();
      clearCurrentProfile();
      logout();
      router.push(ROUTES.AUTH);
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: authKeys.profile() }),
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: authService.changePassword });
}
