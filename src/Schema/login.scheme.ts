import * as zod from "zod";

export const LoginScheme = zod.object({
  email: zod.string().nonempty("this feild is required").email(),
  password: zod
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    ),
});

export type LoginSchemeType = zod.infer<typeof LoginScheme>;
