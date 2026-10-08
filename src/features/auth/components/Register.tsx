import { Button, Select, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { ImSpinner7 } from "react-icons/im";
import { IoPersonSharp } from "react-icons/io5";
import { zodResolver } from "./../../../../node_modules/@hookform/resolvers/zod/src/zod";
import {
  RegisterSchemObj,
  type RegiterSchema,
} from "../../../Schema/regitster.schema";
import { SignUp } from "../apis/register.api";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Register() {
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegiterSchema>({
    resolver: zodResolver(RegisterSchemObj),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      email: "",
      password: "",
      rePassword: "",
      gender: "female",
      username: "",
    },
  });

  async function handleRegister(data: RegiterSchema) {
    setLoading(true);
    try {
      const res = await SignUp(data);
      toast.success(res.message);
      
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleRegister)}
      className="flex max-w-md flex-col gap-4 my-10 mx-auto"
    >
      <div>
        <TextInput
          {...register("name")}
          icon={IoPersonSharp}
          id="Fullname"
          type="text"
          placeholder="Full name"
          theme={{
            field: {
              input: {
                colors: {
                  gray: "!bg-slate-50  !text-gray-900",
                },
              },
            },
          }}
        />

        {/* alert  */}
        {errors?.name && (
          <span className="text-rose-600">{errors.name?.message}</span>
        )}
      </div>
      <div>
        <TextInput
          {...register("username")}
          id="username"
          type="text"
          placeholder="username"
          theme={{
            field: {
              input: {
                colors: {
                  gray: "!bg-slate-50 !text-gray-900",
                },
              },
            },
          }}
        />
      </div>
      {errors?.username && (
        <span className="text-rose-600">{errors.username?.message}</span>
      )}
      <div>
        <TextInput
          {...register("email")}
          id="email"
          type="email"
          placeholder="Email address"
          theme={{
            field: {
              input: {
                colors: {
                  gray: "!bg-slate-50 !text-gray-900",
                },
              },
            },
          }}
        />
        {errors?.email && (
          <span className="text-rose-600">{errors.email?.message}</span>
        )}
      </div>
      <div>
        <TextInput
          id="date"
          type="date"
          {...register("dateOfBirth")}
          theme={{
            field: {
              input: {
                colors: {
                  gray: "!bg-slate-50 !text-gray-900  !text-gray-900",
                },
              },
            },
          }}
        />
        {errors?.dateOfBirth && (
          <span className="text-rose-600">{errors.dateOfBirth?.message}</span>
        )}
      </div>
      <Select
        id="gender"
        {...register("gender")}
        theme={{
          field: {
            select: {
              colors: {
                gray: "!bg-slate-50  !text-gray-900",
              },
            },
          },
        }}
      >
        <option value={"female"}>Female</option>
        <option value={"male"}>Male</option>
      </Select>
      {errors?.gender && (
        <span className="text-rose-600">{errors.gender?.message}</span>
      )}
      <div>
        <TextInput
          {...register("password")}
          id="password1"
          type="password"
          placeholder="password"
          theme={{
            field: {
              input: {
                colors: {
                  gray: "!bg-slate-50  !text-gray-900",
                },
              },
            },
          }}
        />
        {errors?.password && (
          <span className="text-rose-600">{errors.password?.message}</span>
        )}
      </div>
      <div>
        <TextInput
          {...register("rePassword")}
          id="password2"
          type="password"
          placeholder="confirm password"
          theme={{
            field: {
              input: {
                colors: {
                  gray: "!bg-slate-50  !text-gray-900",
                },
              },
            },
          }}
        />
        {errors?.rePassword && (
          <span className="text-rose-600">{errors.rePassword?.message}</span>
        )}
      </div>

      <Button
        disabled={isLoading}
        className="w-full cursor-pointer rounded-xl py-3 text-base font-extrabold text-white transition disabled:opacity-60 bg-[#00298d] hover:bg-[#001f6b]"
        type="submit"
      >
        {isLoading ? <ImSpinner7></ImSpinner7> : "Register"}
      </Button>
    </form>
  );
}
