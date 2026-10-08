import { useQuery } from "@tanstack/react-query";
import { getPosts } from "./api/posts.api";
import Loading from "../../components/Loading";
import PostItems from "../../features/auth/components/PostItems";
import type { Post } from "../../interdaces/posts.inter";
import CreatPost from "../../features/posts/CreatPost";

export default function Feed() {
  const { data, isError, error, isLoading } = useQuery({
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <h2 className="p-6 text-center text-red-600 dark:text-red-400">
        {error?.message}
      </h2>
    );

  const posts: Post[] = data?.data?.posts ?? [];
  return (
    <>
      <CreatPost />
      
      <div className="my-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <aside className="hidden lg:block" />
        <section className="space-y-4 lg:col-span-2">
          {posts.length === 0 && (
            <p className="rounded-lg bg-white p-6 text-center text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400">
              No posts yet.
            </p>
          )}
          {posts.map((post: Post) => (
            <PostItems key={post._id} post={post} />
          ))}
        </section>
        <aside className="hidden lg:block" />
      </div>
    </>
  );
}
