import axios from "axios";

export async function likePost(postId: string) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}