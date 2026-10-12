import { useState } from "react";
import Login from "../../features/auth/components/Login";
import Register from "../../features/auth/components/Register";
import ChangePassword from "../../features/auth/components/ChangePassword";

type View = "login" | "register" | "password";

export default function Home() {
  const [view, setView] = useState<View>("login");

  const tab = (v: View) =>
    `w-1/2 pb-3 text-sm font-semibold transition-colors ${
      view === v
        ? "border-b-2 border-blue-600 text-blue-600"
        : "text-gray-400 hover:text-gray-600"
    }`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        {/* Left: intro */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-blue-600 sm:text-5xl">
            Route Posts
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Connect with friends and the world around you.
          </p>
          <p className="mt-6 hidden text-sm leading-relaxed text-gray-500 md:block">
            Route Academy is Egypt's leading IT training center since 2012,
            specializing in programming, web development, and application
            development.
          </p>
        </div>

        {/* Right: auth card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          {view !== "password" ? (
            <div className="mb-6 flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => setView("login")}
                className={tab("login")}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setView("register")}
                className={tab("register")}
              >
                Register
              </button>
            </div>
          ) : (
            <h2 className="mb-6 border-b border-gray-200 pb-3 text-center text-sm font-semibold text-blue-600">
              Change password
            </h2>
          )}

          {view === "login" && <Login />}
          {view === "register" && <Register />}
          {view === "password" && (
            <ChangePassword onDone={() => setView("login")} />
          )}

          <div className="mt-4 text-center">
            {view === "login" && (
              <button
                type="button"
                onClick={() => setView("password")}
                className="text-sm text-blue-600 hover:underline"
              >
                Change password?
              </button>
            )}
            {view === "password" && (
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-sm text-gray-500 hover:underline"
              >
                Back to login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}