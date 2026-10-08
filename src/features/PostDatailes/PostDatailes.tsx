import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getSinglePost } from "./apis/PostDetailesApi";
import PostItems from "../auth/components/PostItems";
import Loading from "../../components/Loading";
import Comments from "../auth/components/comments/Comments";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();

  const { isLoading, data, isError, error } = useQuery({
    refetchOnMount: false,
    enabled: !!id,
    queryKey: ["post", id],
    queryFn: () => getSinglePost(id as string),
  });

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <div className="mx-auto mt-10 w-11/12 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
        {error.message}
      </div>
    );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-3 py-6 sm:px-0">
      <PostItems post={data.data.post} />

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">
          Comments
        </h3>
        <Comments id={id as string} />
      </section>
    </div>
  );
}