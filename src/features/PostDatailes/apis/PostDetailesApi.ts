import axios from "axios";

export async function getSinglePost(postId: string) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}
