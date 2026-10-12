import { useContext, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { Post } from "../../../interdaces/posts.inter";
import { FaHeart, FaRegComment, FaRegHeart, FaShare } from "react-icons/fa";
import { FiBookmark, FiMoreHorizontal } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import AddComment from "./comments/AddComment";
import EditPostModal from "./EditPostModal";
import { timeAgo } from "../../../utilites/timeAgo";
import { Link } from "react-router-dom";
import PostOptionsDropdown from "../../../components/dropDowncopmpo/DropDown";
import { authContext } from "../../../context/auth.context";
import { likePost } from "../../posts/apis/like";

import { bookmarkPost } from "../../posts/apis/savePost";
import SharePostModal from "./sharePostModal";

export default function PostItems({ post }: { post: Post }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [shares, setShares] = useState(post.sharesCount);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likesCount);

  const { mutate: toggleLike, isPending } = useMutation({
    mutationFn: () => likePost(post._id),
    onMutate: () => {
      const prev = { liked, likes };
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
      return prev;
    },
    onError: (_err, _vars, prev) => {
      if (prev) {
        setLiked(prev.liked);
        setLikes(prev.likes);
      }
    },
  });

  const [saved, setSaved] = useState(false);

  const { mutate: toggleSave, isPending: isSaving } = useMutation({
    mutationFn: () => bookmarkPost(post._id),
    onMutate: () => {
      const prevSaved = saved;
      setSaved(!saved);
      return { prevSaved };
    },
    onError: (_err, _vars, prev) => {
      if (prev) setSaved(prev.prevSaved);
    },
  });

  const context = useContext(authContext);
  const isMyPost = !!context?.user && context.user._id === post.user._id;

  return (
    <article className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
      {/* Post Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-3 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/30"
            src={post.user?.photo}
            alt={post.user.name}
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {post.user.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {timeAgo(post?.createdAt)}
            </span>
          </div>
        </div>

        {isMyPost && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-label="More options"
              onClick={() => setOpen((v) => !v)}
              className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FiMoreHorizontal className="h-5 w-5" />
            </button>
            {open && (
              <PostOptionsDropdown
                id={post._id}
                onClose={() => setOpen(false)}
                onEdit={() => setEditOpen(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* Caption */}
      {post.body && (
        <div className="px-4 pt-3">
          <p className="whitespace-pre-line break-words text-sm text-gray-800 dark:text-gray-100">
            {post.body}
          </p>
        </div>
      )}

      {/* Post Image */}
      {post.image && (
        <div className="mt-3">
          <img
            className="max-h-[480px] w-full object-cover object-center"
            src={post.image}
            alt="Post content"
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label={liked ? "Unlike post" : "Like post"}
            onClick={() => toggleLike()}
            disabled={isPending}
            className={`flex items-center gap-1.5 transition-colors hover:text-red-500 dark:hover:text-red-400 ${
              liked
                ? "text-red-500 dark:text-red-400"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {liked ? (
              <FaHeart className="h-5 w-5" />
            ) : (
              <FaRegHeart className="h-5 w-5" />
            )}
            <span className="text-sm">{likes}</span>
          </button>

          <Link
            to={`/postdetails/${post._id}`}
            aria-label="Comment on post"
            className="flex items-center gap-1.5 text-gray-700 transition-colors hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
          >
            <FaRegComment className="h-5 w-5" />
            <span className="text-sm">{post.commentsCount}</span>
          </Link>

          <button
            type="button"
            aria-label="Share post"
            onClick={() => setShareOpen(true)}
            className="flex items-center gap-1.5 text-gray-700 transition-colors hover:text-green-500 dark:text-gray-300 dark:hover:text-green-400"
          >
            <FaShare className="h-5 w-5" />
            <span className="text-sm">{shares}</span>
          </button>
        </div>

        <button
          type="button"
          aria-label={saved ? "Unsave post" : "Save post"}
          onClick={() => toggleSave()}
          disabled={isSaving}
          className={`transition-colors hover:text-yellow-500 dark:hover:text-yellow-400 ${
            saved
              ? "text-yellow-500 dark:text-yellow-400"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {saved ? (
            <FaBookmark className="h-5 w-5" />
          ) : (
            <FiBookmark className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* View Comments */}
      <div className="px-4 pb-3">
        <Link
          to={`/postdetails/${post._id}`}
          className="text-sm text-gray-500 hover:underline dark:text-gray-400"
        >
          View all {post.commentsCount} comments
        </Link>
      </div>

      {/* Add Comment */}
      <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <img
            className="h-8 w-8 rounded-full object-cover"
            src={context?.user?.photo}
            alt="Your avatar"
          />
          <div className="flex-1">
            <AddComment postId={post._id} />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <EditPostModal post={post} onClose={() => setEditOpen(false)} />
      )}
      {shareOpen && (
        <SharePostModal
          post={post}
          onClose={() => setShareOpen(false)}
          onShared={() => setShares((s) => s + 1)}
        />
      )}
    </article>
  );
}
