import { z } from "zod";

export const ChangePasswordScheme = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
        "Min 8 chars with upper, lower, number and symbol",
      ),
    confirm: z.string().min(1, "Confirm your new password"),
  })
  .refine((v) => v.newPassword === v.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });

export type ChangePasswordSchemeType = z.infer<typeof ChangePasswordScheme>;