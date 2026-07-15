import { z } from "zod";

export const updateProfileSchema = z.object({
  display_name: z.string().min(1).max(50),
  bio: z.string().max(160).optional(),
  is_private: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
  old_password: z.string().min(8),
  new_password: z.string().min(8),
  confirm_password: z.string().min(8),
}).refine((d) => d.new_password === d.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
