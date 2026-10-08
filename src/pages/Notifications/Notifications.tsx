import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getNotfi, markAllAsRead, markAsRead } from "./apis/GetNotfi";
import { timeAgo } from "../../utilites/timeAgo";
import type { NotificationItem, Root } from "./interface/notfy";
import Loading from "../../components/Loading";

const messages: Record<string, string> = {
  like_post: "liked your post",
  comment_post: "commented on your post",
  follow_user: "started following you",
};

export default function Notifications() {
  const navigate = useNavigate();
  const query = useQueryClient();
  const { data, isLoading, isError } = useQuery<Root>({
    queryKey: ["notfy"],
    queryFn: getNotfi,
  });

  const { mutate } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["notfy"] });
      query.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  const { mutate: readAll, isPending: isReadingAll } = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["notfy"] });
      query.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  function handleOpen(n: NotificationItem) {
    if (!n.isRead) {
      mutate(n._id);
    }
    if (n.entityType === "post") {
      navigate(`/postdetails/${n.entityId}`);
    }
  }

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (isError) {
    return (
      <p className="py-10 text-center text-sm text-red-500">
        Something went wrong
      </p>
    );
  }

  const notifications = data?.data.notifications ?? [];
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <section className="mx-auto w-full max-w-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Notifications
        </h1>
        <button
          type="button"
          onClick={() => readAll()}
          disabled={!hasUnread || isReadingAll}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isReadingAll ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
          No notifications yet
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {notifications.map((n) => (
            <li
              key={n._id}
              onClick={() => handleOpen(n)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-3 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 ${
                n.isRead
                  ? "bg-white dark:bg-gray-800"
                  : "bg-blue-50 dark:bg-gray-700/60"
              }`}
            >
              <img
                className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/30"
                src={n.actor.photo}
                alt={n.actor.name}
              />
              <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  <span className="font-semibold">{n.actor.name}</span>{" "}
                  {messages[n.type] ?? n.type}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {timeAgo(n.createdAt)}
                </span>
              </div>
              {!n.isRead && (
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}