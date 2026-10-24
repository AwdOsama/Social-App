import * as zod from "zod";

export const LoginScheme = zod.object({
  email: zod.string().nonempty("this feild is required").email(),
  password: zod.string().min(1, "Password is required"),
});

export type LoginSchemeType = zod.infer<typeof LoginScheme>;