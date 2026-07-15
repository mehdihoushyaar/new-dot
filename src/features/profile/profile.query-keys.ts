export const profileKeys = {
  all: ["profiles"] as const,
  detail: (username: string) => [...profileKeys.all, username] as const,
  relationship: (username: string) => [...profileKeys.all, username, "relationship"] as const,
  followers: (username: string) => [...profileKeys.all, username, "followers"] as const,
  following: (username: string) => [...profileKeys.all, username, "following"] as const,
  dots: (username: string) => [...profileKeys.all, username, "dots"] as const,
  replies: (username: string) => [...profileKeys.all, username, "replies"] as const,
  media: (username: string) => [...profileKeys.all, username, "media"] as const,
  likes: (username: string) => [...profileKeys.all, username, "likes"] as const,
};
