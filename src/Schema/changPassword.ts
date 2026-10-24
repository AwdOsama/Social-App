import { z } from "zod";
import { passwordRule } from "./Password";

export const ChangePasswordScheme = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(1, "Current password is required"),
    newPassword: passwordRule,
    confirm: z.string().min(1, "Confirm your new password"),
  })
  .refine((v) => v.newPassword === v.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });

export type ChangePasswordSchemeType = z.infer<typeof ChangePasswordScheme>;