import axios from "axios";

export async function getReplies({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}

export async function createReply({
  postId,
  commentId,
  content,
}: {
  postId: string;
  commentId: string;
  content: string;
}) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}/replies`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}