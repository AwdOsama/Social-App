import axios from "axios";

export async function deleteComment({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.delete(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}