import { useContext, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiCheck, FiFileText, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";
import { authContext } from "../../context/auth.context";

import MyPosts from "./components/MyPosts";
import { getUserProfile } from "./api/getUserProfile";
import { followUser } from "../../features/posts/apis/follow";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80";

export default function UserProfile() {
  const { id = "" } = useParams<{ id: string }>();
  const context = useContext(authContext);
  const queryClient = useQueryClient();
  const [followOverride, setFollowOverride] = useState<boolean | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => getUserProfile(id),
    enabled: !!id,
  });
  const profile = data?.data?.user;

  const { mutate: toggleFollow, isPending } = useMutation({
    mutationFn: () => followUser(id),
    onMutate: () => {
      setFollowOverride(!following);
    },
    onError: () => {
      setFollowOverride(null);
      toast.error("Something went wrong");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userProfile", id] });
      await queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const serverFollowed = !!profile?.isFollowing;
  const following = followOverride ?? serverFollowed;

  if (context?.user && context.user._id === id) {
    return <Navigate to="/profile" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-full bg-gray-100 px-3 py-6 dark:bg-gray-900 sm:p-8">
        <div className="mx-auto w-full max-w-4xl space-y-4">
          <div className="h-72 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-40 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <p className="py-20 text-center text-sm text-red-500">
        Failed to load profile.
      </p>
    );
  }

  const baseFollowers: number = profile.followersCount ?? 0;
  const followersCount =
    baseFollowers +
    (followOverride === null ? 0 : Number(following) - Number(serverFollowed));
  const followingCount: number = profile.followingCount ?? 0;

  const stats = [
    { label: "Followers", value: followersCount },
    { label: "Following", value: followingCount },
  ];

  return (
    <div className="min-h-full bg-gray-100 px-3 py-6 transition-colors dark:bg-gray-900 sm:p-8">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        {/* Header card */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
          {/* Cover */}
          <div className="relative h-40 w-full sm:h-64">
            <img
              src={profile.cover || DEFAULT_COVER}
              alt="Profile cover"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Info */}
          <div className="px-4 pb-5 sm:px-8">
            <div className="-mt-14 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end sm:gap-5">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md dark:border-gray-800 sm:h-36 sm:w-36"
                />

                <div className="flex flex-col items-center pb-1 text-center sm:items-start sm:text-left">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {profile.name}
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
                  {profile.username && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      @{profile.username}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-5">
                    {stats.map(({ label, value }) => (
                      <span
                        key={label}
                        className="text-sm text-gray-500 dark:text-gray-400"
                      >
                        <span className="font-bold text-gray-900 dark:text-gray-100">
                          {value}
                        </span>{" "}
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleFollow()}
                disabled={isPending}
                className={`rounded-lg px-6 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:opacity-50 ${
                  following
                    ? "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {following ? "Following" : "Follow"}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-4 lg:grid-cols-3">
          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">
              Intro
            </h2>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              {profile.email && (
                <li className="flex items-center gap-3">
                  <FiMail className="h-5 w-5 shrink-0 text-gray-400" />
                  <span className="min-w-0 break-all">{profile.email}</span>
                </li>
              )}
              <li className="flex items-center gap-3">
                <FiCheck className="h-5 w-5 shrink-0 text-blue-500" />
                <span>Verified account</span>
              </li>
            </ul>
          </aside>

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800 lg:col-span-2">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-100">
              <FiFileText className="h-4 w-4" />
              Posts
            </h2>
            <MyPosts userId={id}  />
          </section>
        </div>
      </div>
    </div>
  );
}