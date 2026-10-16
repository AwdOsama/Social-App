import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostComment } from "./apis/comment.api";
import { createReply, getReplies } from "./apis/replais";
import Loading from "../../../../components/Loading";
import type { Comment as CommentInterface } from "./interfaces/CommentIterface";
import { timeAgo } from "../../../../utilites/timeAgo";
import { authContext } from "../../../../context/auth.context";
import { updateComment } from "./apis/update";
import { deleteComment } from "./apis/deleteComment";
import { likeComment } from "./apis/likeComment";

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
        <CommentItem comment={comment} postId={id} key={comment._id} />
      ))}
    </div>
  );
}

function CommentItem({
  comment,
  postId,
}: {
  comment: CommentInterface;
  postId: string;
}) {
  const creator = comment.commentCreator;
  const query = useQueryClient();
  const context = useContext(authContext);
  const isMine = !!context?.user && context.user._id === creator?._id;

  const [showReplies, setShowReplies] = useState(false);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.content);

  const [liked, setLiked] = useState(
    !!context?.user &&
      comment.likes.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (l: any) => (l?._id ?? l) === context.user?._id,
      ),
  );
  const [likesCount, setLikesCount] = useState(comment.likes.length);

  const { mutate: toggleLike, isPending: isLiking } = useMutation({
    mutationFn: likeComment,
    onMutate: () => {
      const prev = { liked, likesCount };
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      return prev;
    },
    onError: (_err, _vars, prev) => {
      if (prev) {
        setLiked(prev.liked);
        setLikesCount(prev.likesCount);
      }
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["comment", postId] });
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["comment", postId] });
      setEditing(false);
    },
  });

  const { mutate: remove, isPending: isDeleting } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["comment", postId] });
      query.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  function handleSave() {
    if (!text.trim()) return;
    mutate({ postId, commentId: comment._id, content: text.trim() });
  }

  function handleCancel() {
    setText(comment.content);
    setEditing(false);
  }

  function handleDelete() {
    remove({ postId, commentId: comment._id });
  }

  return (
    <div className="flex items-start gap-3">
      <img
        className="h-9 w-9 shrink-0 rounded-full object-cover"
        src={creator?.photo}
        alt={creator?.name}
      />

      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isPending || !text.trim()}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
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
          </div>
        )}

        <div className="mt-1 flex items-center gap-4 px-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{timeAgo(comment.createdAt)}</span>
          <button
            type="button"
            onClick={() => toggleLike({ postId, commentId: comment._id })}
            disabled={isLiking}
            className={`font-semibold transition-colors hover:underline ${
              liked
                ? "text-blue-600 dark:text-blue-400"
                : "hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            Like{likesCount > 0 && ` (${likesCount})`}
          </button>
          <button
            type="button"
            onClick={() => setShowReplies((v) => !v)}
            className="font-semibold transition-colors hover:text-blue-600 hover:underline dark:hover:text-blue-400"
          >
            Reply{comment.repliesCount > 0 && ` (${comment.repliesCount})`}
          </button>
          {isMine && !editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="font-semibold transition-colors hover:text-blue-600 hover:underline dark:hover:text-blue-400"
            >
              Edit
            </button>
          )}
          {isMine && !editing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="font-semibold transition-colors hover:text-red-600 hover:underline disabled:opacity-50 dark:hover:text-red-400"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        {showReplies && <Replies postId={postId} commentId={comment._id} />}
      </div>
    </div>
  );
}

function Replies({ postId, commentId }: { postId: string; commentId: string }) {
  const query = useQueryClient();
  const [content, setContent] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["replies", commentId],
    queryFn: () => getReplies({ postId, commentId }),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createReply,
    onSuccess: () => {
      setContent("");
      query.invalidateQueries({ queryKey: ["replies", commentId] });
      query.invalidateQueries({ queryKey: ["comment", postId] });
    },
  });

  function handleSend() {
    if (!content.trim()) return;
    mutate({ postId, commentId, content: content.trim() });
  }

  const replies: CommentInterface[] = data?.data?.replies ?? [];

  return (
    <div className="mt-3 flex flex-col gap-3 border-l-2 border-gray-200 pl-3 dark:border-gray-700">
      {isLoading ? (
        <p className="text-xs text-gray-500 dark:text-gray-400">Loading...</p>
      ) : (
        replies.map((reply) => (
          <div key={reply._id} className="flex items-start gap-2">
            <img
              className="h-7 w-7 shrink-0 rounded-full object-cover"
              src={reply.commentCreator?.photo}
              alt={reply.commentCreator?.name}
            />
            <div className="min-w-0">
              <div className="inline-block max-w-full rounded-2xl bg-gray-100 px-3 py-2 dark:bg-gray-700">
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {reply.commentCreator?.name}
                </span>
                <p className="whitespace-pre-line break-words text-sm text-gray-800 dark:text-gray-200">
                  {reply.content}
                </p>
              </div>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                {timeAgo(reply.createdAt)}
              </span>
            </div>
          </div>
        ))
      )}

      <div className="flex items-center gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Write a reply..."
          className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={isPending || !content.trim()}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
