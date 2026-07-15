export const homeTimelineKeys = {
  all: ["homeTimeline"] as const,
  lists: () => [...homeTimelineKeys.all, "list"] as const,
  list: (tab: "for-you" | "following") => [...homeTimelineKeys.lists(), tab] as const,
};

export const postKeys = {
  all: ["posts"] as const,
  detail: (id: string) => [...postKeys.all, "detail", id] as const,
  replies: (id: string) => [...postKeys.all, "replies", id] as const,
  bookmarks: () => [...postKeys.all, "bookmarks"] as const,
  drafts: () => [...postKeys.all, "drafts"] as const,
  profileDots: (username: string) => [...postKeys.all, "profile", username, "dots"] as const,
  profileReplies: (username: string) => [...postKeys.all, "profile", username, "replies"] as const,
  profileMedia: (username: string) => [...postKeys.all, "profile", username, "media"] as const,
  profileLikes: (username: string) => [...postKeys.all, "profile", username, "likes"] as const,
};
