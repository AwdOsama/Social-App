import { useQuery } from "@tanstack/react-query";
import { FiFileText } from "react-icons/fi";
import type { Post } from "../../../interdaces/posts.inter";
import { getMyPosts } from "../api/getMyPosts";
import PostItems from "../../../features/auth/components/PostItems";
import Loading from "../../../components/Loading";

export default function MyPosts({
  userId,
  emptyText = "You haven't posted anything yet.",
}: {
  userId: string;
  emptyText?: string;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myPosts", userId],
    queryFn: () => getMyPosts(userId),
  });

  const posts: Post[] = data?.data?.posts ?? [];

  if (isLoading) {
    return (
    <Loading></Loading>
    );
  }

  if (isError) {
    return (
      <p className="py-10 text-center text-sm text-red-500">
        Failed to load posts.
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-gray-500 dark:text-gray-400">
        <FiFileText className="h-10 w-10" />
        <p className="text-sm">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostItems key={post._id} post={post} />
      ))}
    </div>
  );
}