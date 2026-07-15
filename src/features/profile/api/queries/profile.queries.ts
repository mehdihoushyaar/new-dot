import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import profileService from "../requests/profile.requests";
import { profileKeys } from "../../profile.query-keys";

export function useProfileByUsername(username: string) {
  return useQuery({
    queryKey: profileKeys.detail(username),
    queryFn: () => profileService.getByUsername(username).then((r) => r.data),
    enabled: !!username,
  });
}

export function useRelationship(username: string) {
  return useQuery({
    queryKey: profileKeys.relationship(username),
    queryFn: () => profileService.getRelationship(username).then((r) => r.data),
    enabled: !!username,
  });
}

export function useProfileDots(username: string) {
  return useInfiniteQuery({
    queryKey: profileKeys.dots(username),
    queryFn: ({ pageParam }) =>
      profileService.getProfileDots(username, pageParam as string | undefined).then((r) => r.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (p) => p.next ?? undefined,
    enabled: !!username,
  });
}

export function useProfileReplies(username: string) {
  return useInfiniteQuery({
    queryKey: profileKeys.replies(username),
    queryFn: ({ pageParam }) =>
      profileService.getProfileReplies(username, pageParam as string | undefined).then((r) => r.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (p) => p.next ?? undefined,
    enabled: !!username,
  });
}

export function useProfileMedia(username: string) {
  return useInfiniteQuery({
    queryKey: profileKeys.media(username),
    queryFn: ({ pageParam }) =>
      profileService.getProfileMedia(username, pageParam as string | undefined).then((r) => r.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (p) => p.next ?? undefined,
    enabled: !!username,
  });
}

export function useProfileLikes(username: string) {
  return useInfiniteQuery({
    queryKey: profileKeys.likes(username),
    queryFn: ({ pageParam }) =>
      profileService.getProfileLikes(username, pageParam as string | undefined).then((r) => r.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (p) => p.next ?? undefined,
    enabled: !!username,
  });
}
