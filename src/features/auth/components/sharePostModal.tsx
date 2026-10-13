import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiX } from "react-icons/fi";
import type { Post } from "../../../interdaces/posts.inter";
import { sharePost } from "../../posts/apis/sharePos";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";

type Props = {
  post: Post;
  onClose: () => void;
  onShared: () => void;
};

export default function SharePostModal({ post, onClose, onShared }: Props) {
  const query = useQueryClient();
  const [body, setBody] = useState("");



const { isPending, mutate } = useMutation({
  mutationFn: sharePost,
  onError: (err) => {
    const msg = isAxiosError(err) ? err.response?.data?.message : undefined;
    toast.error(msg ?? "Something went wrong");
  },
});;

  function handleShare() {
    mutate(
      { postId: post._id, body },
      {
        onSuccess: () => {
          query.invalidateQueries({ queryKey: ["posts"] });
          onShared();
          onClose();
        },
      },
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Share post
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 p-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Say something about this post..."
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />

          {/* Original post preview */}
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 p-3">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={post.user?.photo}
                alt={post.user.name}
              />
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {post.user.name}
              </span>
            </div>
            {post.body && (
              <p className="line-clamp-3 whitespace-pre-line break-words px-3 pb-3 text-sm text-gray-700 dark:text-gray-300">
                {post.body}
              </p>
            )}
            {post.image && (
              <img
                className="max-h-48 w-full object-cover object-center"
                src={post.image}
                alt="Post content"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-4 py-3 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleShare}
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}