import axios from "axios";

export async function sharePost({ postId, body }: { postId: string; body: string }) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/share`,
    { body },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}