import { getPostComment } from "./apis/comment.api";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../../components/Loading";
import type { Comment as CommentInterface } from "./interfaces/CommentIterface";
import { timeAgo } from "../../../../utilites/timeAgo";

export default function Comments({ id }: { id: string }) {
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ["comment", id],
    queryFn: () => getPostComment(id),
  });

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
        {error.message}
      </p>
    );

  const comments: CommentInterface[] = data?.data?.comments ?? [];

  if (comments.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        No comments yet
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment: CommentInterface) => (
        <CommentItem comment={comment} key={comment._id} />
      ))}
    </div>
  );
}

function CommentItem({ comment }: { comment: CommentInterface }) {
  const creator = comment.commentCreator;

  return (
    <div className="flex items-start gap-3">
      <img
        className="h-9 w-9 shrink-0 rounded-full object-cover"
        src={creator?.photo}
        alt={creator?.name}
      />

      <div className="min-w-0 flex-1">
        <div className="inline-block max-w-full rounded-2xl bg-gray-100 px-4 py-2 transition-colors dark:bg-gray-700">
          <div className="flex flex-wrap items-center gap-x-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {creator?.name}
            </span>
            {creator?.username && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                @{creator.username}
              </span>
            )}
          </div>

          <p className="mt-1 whitespace-pre-line break-words text-sm text-gray-800 dark:text-gray-200">
            {comment.content}
          </p>
{/* 
          {comment.commentCreator.photo && (
            <img
              src={comment.commentCreator.photo}
              alt="Comment attachment"
              className="mt-2 max-h-60 max-w-full rounded-lg object-cover"
            />
          )} */}
        </div>

        <div className="mt-1 flex items-center gap-4 px-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{timeAgo(comment.createdAt)}</span>
          <button
            type="button"
            className="font-semibold transition-colors hover:text-blue-600 hover:underline dark:hover:text-blue-400"
          >
            Like{comment.likes.length > 0 && ` (${comment.likes.length})`}
          </button>
          <button
            type="button"
            className="font-semibold transition-colors hover:text-blue-600 hover:underline dark:hover:text-blue-400"
          >
            Reply{comment.repliesCount > 0 && ` (${comment.repliesCount})`}
          </button>
        </div>
      </div>
    </div>
  );
}