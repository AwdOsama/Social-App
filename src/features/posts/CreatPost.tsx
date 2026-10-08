import React, { useContext, useState } from "react";
import { MdPhotoLibrary } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { AddPost } from "./apis/CreatPostApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { authContext } from "../../context/auth.context";

export default function CreatPost() {
  const [body, setbody] = useState<string>("");
  const [image, setimage] = useState<File | null>(null);
  const [imagePereview, setimagePereview] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const context = useContext(authContext);

  const { isPending, mutate } = useMutation({
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    mutationFn: AddPost,
  });

  function handelBody(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setbody(e.target.value);
  }
  function handelImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setimage(file);
    const imgSrc = URL.createObjectURL(file);
    setimagePereview(imgSrc);
  }
  function handelSubmit() {
    if (!body && !image) return;
    const formData = new FormData();
    formData.append("body", body);
    if (image) {
      formData.append("image", image);
    }
    mutate(formData);
    handelCancel();
  }
  function handelCancel() {
    setbody("");
    setimage(null);
    setimagePereview(null);
  }

  const canPost = (!!body.trim() || !!image) && !isPending;

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
      {/* Top: avatar + textarea */}
      <div className="flex gap-3">
        <img
          src={context?.user?.photo}
          alt="Your avatar"
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <textarea
          onChange={handelBody}
          value={body}
          spellCheck="false"
          rows={body ? 3 : 2}
          placeholder={`What's on your mind, ${context?.user?.name?.split(" ")[0] ?? ""}?`}
          className="w-full resize-none rounded-2xl bg-gray-100 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-500 outline-none transition-colors focus:ring-2 focus:ring-blue-500/40 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
        />
      </div>

      {/* Image preview */}
      {imagePereview && (
        <div className="relative mt-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
          <img
            src={imagePereview}
            alt="Preview"
            className="max-h-80 w-full object-contain"
          />
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => {
              setimagePereview(null);
              setimage(null);
            }}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-gray-700 shadow transition-colors hover:bg-white hover:text-red-500 dark:bg-gray-800/90 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-red-400"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>
      )}

      <hr className="my-3 border-gray-200 dark:border-gray-700" />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="attachment"
          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <MdPhotoLibrary className="h-6 w-6 text-green-500" />
          Photo
        </label>
        <input
          type="file"
          id="attachment"
          accept="image/*"
          className="hidden"
          onChange={handelImage}
        />

        <div className="flex items-center gap-2">
          {(body || image) && (
            <button
              type="button"
              onClick={handelCancel}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handelSubmit}
            disabled={!canPost}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}