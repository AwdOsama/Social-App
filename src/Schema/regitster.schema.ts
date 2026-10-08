import * as zod from "zod";

// schema
export  const RegisterSchemObj = zod
  .object({
    name: zod
      .string()
      .nonempty("this field is required!")
      .min(2, "min char 2 char")
      .max(15, "max chars 15 "),
    username: zod.string().min(2, "min char 2 char").max(15, "max chars 15 "),
    gender: zod.enum(["female", "male"]),
    email: zod
      .string()
      .nonempty("this field is required!")
      .email("not valid email"),
    password: zod
      .string()
      .nonempty("this field is required!")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      ),
    rePassword: zod.string().nonempty("this field is required!"),
    dateOfBirth: zod.string().refine(
      (data) => {
        const myYear = new Date(data).getFullYear();
        const thisYear = new Date().getFullYear();

        return thisYear - myYear > 10;
      },
      {
        error: "age > 10",
      },
    ),
  })
  .refine(
    (data) => {
      return data.password === data.rePassword;
    },
    {
      error: "dont match",
      path: ["rePassword"],
    },
  );


 export type RegiterSchema = zod.infer<typeof RegisterSchemObj>;