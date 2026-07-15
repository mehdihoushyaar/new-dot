"use client";
import { useEffect, type ReactNode } from "react";
import { useAuthFlowStore } from "@/store/auth.store";
import { useCurrentProfileStore } from "@/store/profile.store";
import { registerAuthInvalidate } from "@/services/api/interceptors";
import { useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "@/store/chat.store";
import socketClient from "@/services/websocket/socket-client";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, user, setLoggedIn } = useAuthFlowStore();
  const { setProfile, setStarsBalance } = useCurrentProfileStore();
  const { resetChatState } = useChatStore();
  const qc = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    registerAuthInvalidate(() => {
      socketClient.disconnect();
      resetChatState();
      qc.clear();
      localStorage.removeItem("auth-storage");
      useAuthFlowStore.getState().logout();
      router.push(ROUTES.AUTH);
    });
  }, []);

  useEffect(() => {
    if (isLoggedIn && user) {
      setProfile(user);
    }
  }, [isLoggedIn, user]);

  return <>{children}</>;
}
