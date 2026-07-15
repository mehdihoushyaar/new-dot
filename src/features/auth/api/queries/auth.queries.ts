import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import authService from "../../api/requests/auth.requests";
import { authKeys } from "../../auth.query-keys";
import type { User } from "@/entities/user";

export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: (): Promise<User> =>
      authService.getProfile().then((r: AxiosResponse<User>) => r.data),
  });
}

export function useBadges() {
  return useQuery({
    queryKey: authKeys.badges(),
    queryFn: (): Promise<unknown> =>
      authService.getBadges().then((r: AxiosResponse<unknown>) => r.data),
  });
}
