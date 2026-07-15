import { useMutation, useQueryClient } from "@tanstack/react-query";
import profileService from "../requests/profile.requests";
import { profileKeys } from "../../profile.query-keys";
import {
  applyFollowStateToHomeTimeline,
  applyBlockStateToHomeTimeline,
  applyMuteStateToHomeTimeline,
} from "@/features/posts/logic/timeline.patchers";

export function useFollow(username: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ follow }: { follow: boolean }) =>
      follow ? profileService.follow(username) : profileService.unfollow(username),
    onSuccess: (_data, { follow }) => {
      applyFollowStateToHomeTimeline(qc, username, follow);
      qc.invalidateQueries({ queryKey: profileKeys.relationship(username) });
      qc.invalidateQueries({ queryKey: profileKeys.detail(username) });
    },
  });
}

export function useBlock(username: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ block }: { block: boolean }) =>
      block ? profileService.block(username) : profileService.unblock(username),
    onSuccess: (_data, { block }) => {
      if (block) applyBlockStateToHomeTimeline(qc, username);
      qc.invalidateQueries({ queryKey: profileKeys.relationship(username) });
    },
  });
}

export function useMute(username: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ mute }: { mute: boolean }) =>
      mute ? profileService.mute(username) : profileService.unmute(username),
    onSuccess: (_data, { mute }) => {
      applyMuteStateToHomeTimeline(qc, username, mute);
      qc.invalidateQueries({ queryKey: profileKeys.relationship(username) });
    },
  });
}
