import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().min(1).max(280),
  reply_permission: z.enum(["everyone", "following", "mentioned", "none"]).default("everyone"),
  media_ids: z.array(z.string()).max(4).optional(),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
