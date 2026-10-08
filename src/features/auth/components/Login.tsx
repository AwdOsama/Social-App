import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { IoPersonSharp } from "react-icons/io5";
import {
  LoginScheme,
  type LoginSchemeType,
} from "../../../Schema/login.scheme";
import { useContext, useState } from "react";
import { SignIn } from "../apis/login.api";
import { toast } from "react-toastify";
import { ImSpinner7 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../../context/auth.context";

export default function Login() {
  const [isLoading, setLoading] = useState(false);

  const context = useContext(authContext);
  if (!context) throw new Error("Login must be used inside AuthContextProvider");
  const { setisLogin, setUser } = context;

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginSchemeType>({
    resolver: zodResolver(LoginScheme),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(data: LoginSchemeType) {
    setLoading(true);
    try {
      const res = await SignIn(data);
      if (res?.success) {
        localStorage.setItem("TKN", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setisLogin(res.data.token);
        setUser(res.data.user);
        toast.success(res.message);
        navigate("/feed");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex max-w-md flex-col gap-4 my-10 mx-auto"
      >
        <div>
          <TextInput
            {...register("email")}
            icon={IoPersonSharp}
            id="email"
            type="text"
            placeholder="email"
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
            {...register("password")}
            id="password"
            type="password"
            placeholder="password"
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
          {errors?.password && (
            <span className="text-rose-600">{errors.password?.message}</span>
          )}
        </div>
        <Button
          className="w-full cursor-pointer rounded-xl py-3 text-base font-extrabold text-white transition disabled:opacity-60 bg-[#00298d] hover:bg-[#001f6b]"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <ImSpinner7 className="animate-spin" /> : "Login"}
        </Button>
      </form>
    </div>
  );
}