import axios from "axios";

export async function updateComment({
  postId,
  commentId,
  content,
}: {
  postId: string;
  commentId: string;
  content: string;
}) {
  const token = localStorage.getItem("TKN");
  const formData = new FormData();
  formData.append("content", content);
  const { data } = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}`,
    formData,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}