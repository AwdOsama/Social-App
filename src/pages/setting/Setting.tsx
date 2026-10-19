import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiLock } from "react-icons/fi";
import { authContext } from "../../context/auth.context";
import ChangePassword from "./ChangePassword";

export default function Setting() {
  const navigate = useNavigate();
  const context = useContext(authContext);
  if (!context)
    throw new Error("Setting must be used within AuthContextProvider");

  function handleDone() {
    localStorage.removeItem("TKN");
    context!.setisLogin(null);
    toast.success("Password changed, please login again");
    navigate("/");
  }

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-gray-700 dark:text-blue-400">
            <FiLock className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Change password
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your current password and choose a new one.
            </p>
          </div>
        </div>

        <ChangePassword onDone={handleDone} />
      </div>
    </section>
  );
}
