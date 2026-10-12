import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { ImSpinner7 } from "react-icons/im";
import { IoPersonSharp } from "react-icons/io5";

import { SignIn } from "../apis/login.api";
import {
  ChangePasswordScheme,
  ChangePasswordSchemeType,
} from "../../../Schema/changPassword";
import { changePassword } from "../apis/changePassword";

const inputTheme = {
  field: { input: { colors: { gray: "!bg-slate-50 !text-gray-900" } } },
};

export default function ChangePassword({ onDone }: { onDone: () => void }) {
  const [isLoading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ChangePasswordSchemeType>({
    resolver: zodResolver(ChangePasswordScheme),
    defaultValues: { email: "", password: "", newPassword: "", confirm: "" },
  });

  async function handleChange(data: ChangePasswordSchemeType) {
    setLoading(true);
    try {
      const login = await SignIn({
        email: data.email,
        password: data.password,
      });
      await changePassword({
        token: login.data.token,
        password: data.password,
        newPassword: data.newPassword,
      });
      toast.success("Password changed, you can login now");
      onDone();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleChange)}
      className="mx-auto flex max-w-md flex-col gap-4 my-6"
    >
      <div>
        <TextInput
          {...register("email")}
          icon={IoPersonSharp}
          type="text"
          placeholder="email"
          theme={inputTheme}
        />
        {errors.email && (
          <span className="text-rose-600">{errors.email.message}</span>
        )}
      </div>
      <div>
        <TextInput
          {...register("password")}
          type="password"
          placeholder="current password"
          theme={inputTheme}
        />
        {errors.password && (
          <span className="text-rose-600">{errors.password.message}</span>
        )}
      </div>
      <div>
        <TextInput
          {...register("newPassword")}
          type="password"
          placeholder="new password"
          theme={inputTheme}
        />
        {errors.newPassword && (
          <span className="text-rose-600">{errors.newPassword.message}</span>
        )}
      </div>
      <div>
        <TextInput
          {...register("confirm")}
          type="password"
          placeholder="confirm new password"
          theme={inputTheme}
        />
        {errors.confirm && (
          <span className="text-rose-600">{errors.confirm.message}</span>
        )}
      </div>
      <Button
        className="w-full cursor-pointer rounded-xl bg-[#00298d] py-3 text-base font-extrabold text-white transition hover:bg-[#001f6b] disabled:opacity-60"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <ImSpinner7 className="animate-spin" />
        ) : (
          "Change password"
        )}
      </Button>
    </form>
  );
}
