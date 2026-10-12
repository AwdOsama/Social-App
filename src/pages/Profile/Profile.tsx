import { useContext, useRef, useState } from "react";
import {
  FiCamera,
  FiCheck,
  FiEdit2,
  FiFileText,
  FiImage,
  FiInfo,
  FiMail,
} from "react-icons/fi";
import { authContext } from "../../context/auth.context";
import { toast } from "react-toastify";
import { uploadPhoto } from "../../features/posts/apis/uploadPhotoProfile";
import { useMutation } from "@tanstack/react-query";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80";

const TABS = [
  { key: "posts", label: "Posts", icon: FiFileText },
  { key: "about", label: "About", icon: FiInfo },
  { key: "photos", label: "Photos", icon: FiImage },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function Profile() {
  const context = useContext(authContext);
  const [tab, setTab] = useState<TabKey>("posts");
  const fileRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: uploadPhoto,
    onSuccess: (res) => {
      const photo: string | undefined = res?.data?.photo;
      if (photo && context?.user) {
        const updated = { ...context.user, photo };
        context.setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      }
      toast.success("Photo updated");
    },
    onError: () => toast.error("Upload failed"),
  });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    mutate(file);
    e.target.value = "";
  }

  if (!context) return null;

  const { user } = context;
  if (!user) return null;

  return (
    <div className="min-h-full bg-gray-100 px-3 py-6 transition-colors dark:bg-gray-900 sm:p-8">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        {/* Header card */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
          {/* Cover */}
          <div className="group relative h-40 w-full sm:h-64">
            <img
              src={user.cover || DEFAULT_COVER}
              alt="Profile cover"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <button
              type="button"
              className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow transition-colors hover:bg-white dark:bg-gray-900/80 dark:text-gray-100 dark:hover:bg-gray-900"
            >
              <FiCamera className="h-4 w-4" />
              <span className="hidden sm:inline">Edit cover</span>
            </button>
          </div>

          {/* Info */}
          <div className="px-4 sm:px-8">
            <div className="-mt-14 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end sm:gap-5">
                <div className="relative">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md dark:border-gray-800 sm:h-36 sm:w-36"
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFile}
                  />
                  <button
                    type="button"
                    aria-label="Change photo"
                    onClick={() => fileRef.current?.click()}
                    disabled={isPending}
                    className="absolute bottom-1 right-1 rounded-full border-2 border-white bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  >
                    <FiCamera className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col items-center pb-1 text-center sm:items-start sm:text-left">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {user.name}
                    </h1>
                    <span
                      className="rounded-full bg-blue-500 p-1"
                      title="Verified"
                    >
                      <FiCheck
                        className="h-2.5 w-2.5 text-white"
                        strokeWidth={4}
                      />
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
              >
                <FiEdit2 className="h-4 w-4" />
                <span>Edit profile</span>
              </button>
            </div>

            {/* Tabs */}
            <nav className="mt-5 flex justify-center gap-1 border-t border-gray-200 dark:border-gray-700 sm:justify-start">
              {TABS.map(({ key, label, icon: Icon }) => {
                const active = tab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Intro */}
          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">
              Intro
            </h2>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-3">
                <FiMail className="h-5 w-5 shrink-0 text-gray-400" />
                <span className="min-w-0 break-all">{user.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiCheck className="h-5 w-5 shrink-0 text-blue-500" />
                <span>Verified account</span>
              </li>
            </ul>
          </aside>

          {/* Tab content */}
          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 lg:col-span-2">
            <h2 className="mb-3 text-base font-semibold capitalize text-gray-900 dark:text-gray-100">
              {tab}
            </h2>
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-gray-500 dark:text-gray-400">
              {tab === "posts" && <FiFileText className="h-10 w-10" />}
              {tab === "about" && <FiInfo className="h-10 w-10" />}
              {tab === "photos" && <FiImage className="h-10 w-10" />}
              <p className="text-sm">Nothing to show here yet.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
