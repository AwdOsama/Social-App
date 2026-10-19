import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { ImSpinner7 } from "react-icons/im";
import { IoPersonSharp } from "react-icons/io5";

import { SignIn } from "../../features/auth/apis/login.api";
import {
  ChangePasswordScheme,
  ChangePasswordSchemeType,
} from "../../Schema/changPassword";
import { changePassword } from "./api/changePassword";

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

const labelClass = "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300";

return (
  <form onSubmit={handleSubmit(handleChange)} className="flex w-full flex-col gap-4">
    <div>
      <label className={labelClass}>Email</label>
      <TextInput
        {...register("email")}
        icon={IoPersonSharp}
        type="text"
        placeholder="email"
        theme={inputTheme}
      />
      {errors.email && (
        <span className="text-sm text-rose-600">{errors.email.message}</span>
      )}
    </div>

    <div>
      <label className={labelClass}>Current password</label>
      <TextInput
        {...register("password")}
        type="password"
        placeholder="current password"
        theme={inputTheme}
      />
      {errors.password && (
        <span className="text-sm text-rose-600">{errors.password.message}</span>
      )}
    </div>

    <div>
      <label className={labelClass}>New password</label>
      <TextInput
        {...register("newPassword")}
        type="password"
        placeholder="new password"
        theme={inputTheme}
      />
      {errors.newPassword && (
        <span className="text-sm text-rose-600">{errors.newPassword.message}</span>
      )}
    </div>

    <div>
      <label className={labelClass}>Confirm new password</label>
      <TextInput
        {...register("confirm")}
        type="password"
        placeholder="confirm new password"
        theme={inputTheme}
      />
      {errors.confirm && (
        <span className="text-sm text-rose-600">{errors.confirm.message}</span>
      )}
    </div>

    <Button
      className="w-full cursor-pointer rounded-xl bg-[#00298d] py-1 text-base font-extrabold text-white transition hover:bg-[#001f6b] disabled:opacity-60"
      type="submit"
      disabled={isLoading}
    >
      {isLoading ? <ImSpinner7 className="animate-spin" /> : "Change password"}
    </Button>
  </form>
);
}
