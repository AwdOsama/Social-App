import axios from "axios";

export async function likeComment({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}