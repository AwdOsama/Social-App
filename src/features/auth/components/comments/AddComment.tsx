import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { MdPhotoCamera } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "./apis/addCommentApi";
import { toast } from "react-toastify";

interface AddCommentProps {
  postId: string;
}

export default function AddComment({ postId }: AddCommentProps) {
  const [content, setContent] = useState<string>("");
  const [image, setimage] = useState<File | null>(null);
  const [imagePreview, setimagePereview] = useState<string | null>(null);

  const isEmpty = content.trim() === "";
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: addComment,

    onSuccess: (data) => {
      toast.success(data?.message);

      queryClient.invalidateQueries({
        queryKey: ["comment", postId],
      });

      handleCancel();
    },

    onError: () => {
      toast.error("Failed to add comment");
    },
  });
  function handleContent(e: React.ChangeEvent<HTMLInputElement>) {
    setContent(e.target.value);
  }
  function handelImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setimage(file);
    const imgSrc = URL.createObjectURL(file);
    setimagePereview(imgSrc);
  }
  function handleSubmit() {
    if (isEmpty) return;

    const formData = new FormData();

    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    mutate({ formData, postId });
  }

  function handleCancel() {
    setContent("");
    setimage(null);
    setimagePereview(null);
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 transition-colors focus-within:ring-2 focus-within:ring-blue-500/40 dark:bg-gray-700">
        <input
          type="text"
          placeholder="Add a comment..."
          value={content}
          onChange={handleContent}
          className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-gray-800 placeholder-gray-500 outline-none dark:text-gray-100 dark:placeholder-gray-400"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handelImage}
          className="hidden"
          id="comment-image"
        />

        <label
          htmlFor="comment-image"
          aria-label="Attach image"
          className="cursor-pointer rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
        >
          <MdPhotoCamera className="h-5 w-5" />
        </label>

        <button
          type="button"
          aria-label="Add comment"
          disabled={isEmpty || isPending}
          onClick={handleSubmit}
          className="rounded-full p-1.5 text-blue-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 dark:text-blue-400 dark:hover:bg-gray-600"
        >
          {isPending ? (
            <span className="px-1 text-xs font-semibold">Adding...</span>
          ) : (
            <IoSend className="h-5 w-5" />
          )}
        </button>
      </div>

      {imagePreview && (
        <div className="relative mt-2 inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="h-20 w-20 rounded-lg border border-gray-200 object-cover dark:border-gray-600"
          />
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => {
              setimagePereview(null);
              setimage(null);
            }}
            className="absolute -right-2 -top-2 rounded-full bg-white p-0.5 text-gray-700 shadow transition-colors hover:text-red-500 dark:bg-gray-800 dark:text-gray-200 dark:hover:text-red-400"
          >
            <IoClose className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}