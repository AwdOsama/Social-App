import axios from "axios";

export async function bookmarkPost(postId: string) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/bookmark`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}