import * as zod from "zod";

export const LoginScheme = zod.object({
  email: zod.string().nonempty("this feild is required").email(),
  password: zod
    .string()
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
        "Min 8 chars with upper, lower, number and symbol",
      ),
});

export type LoginSchemeType = zod.infer<typeof LoginScheme>;
