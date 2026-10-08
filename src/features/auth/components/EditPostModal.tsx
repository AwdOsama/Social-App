import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiImage, FiX } from "react-icons/fi";
import type { Post } from "../../../interdaces/posts.inter";
import { updatePost } from "../../posts/apis/Updata.post";

type Props = {
  post: Post;
  onClose: () => void;
};

export default function EditPostModal({ post, onClose }: Props) {
  const query = useQueryClient();
  const [body, setBody] = useState(post.body ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(post.image ?? null);

  const { isPending, mutate } = useMutation({
    mutationFn: updatePost,
  });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function handleSubmit() {
    const formData = new FormData();
    formData.append("body", body);
    if (file) formData.append("image", file);

    mutate(
      { id: post._id, formData },
      {
        onSuccess: () => {
          query.invalidateQueries({ queryKey: ["posts"] });
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
            Edit post
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
          <div className="flex items-center gap-3">
            <img
              className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/30"
              src={post.user?.photo}
              alt={post.user.name}
            />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {post.user.name}
            </span>
          </div>

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="What's on your mind?"
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />

          {preview && (
            <img
              className="max-h-64 w-full rounded-lg object-cover object-center"
              src={preview}
              alt="Post preview"
            />
          )}

          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
            <FiImage className="h-5 w-5 text-green-500" />
            {preview ? "Change image" : "Add image"}
            <input type="file" accept="image/*" hidden onChange={handleFile} />
          </label>
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
            onClick={handleSubmit}
            disabled={isPending || (!body.trim() && !preview)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
