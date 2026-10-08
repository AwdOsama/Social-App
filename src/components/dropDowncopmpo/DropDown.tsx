import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { deletePost } from "../../features/posts/apis/deletePostsApi";

type Props = {
  onClose: () => void;
  onEdit: () => void;
  id: string;
};

export default function PostOptionsDropdown({ onClose, onEdit, id }: Props) {
  const query = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: deletePost,
  });

  function handleDeletePost(postId: string) {
    mutate(postId, {
      onSuccess: () => {
        query.invalidateQueries({ queryKey: ["posts"] });
        onClose();
      },
    });
  }

  function handleEditPost() {
    onEdit();
    onClose();
  }

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <button
        type="button"
        onClick={handleEditPost}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <FiEdit2 className="h-4 w-4" />
        Edit
      </button>

      <button
        type="button"
        onClick={() => handleDeletePost(id)}
        disabled={isPending}
        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-500/10"
      >
        <FiTrash2 className="h-4 w-4" />
        {isPending ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}