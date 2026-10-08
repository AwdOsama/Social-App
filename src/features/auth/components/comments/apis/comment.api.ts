import axios from "axios";

export async function getPostComment(postId: string) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments?page=1&limit=10`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}
