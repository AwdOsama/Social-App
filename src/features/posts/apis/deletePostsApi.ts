import axios from "axios";

export async function deletePost(postId: string) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.delete(`${import.meta.env.VITE_BASE_URL}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}




`,
    },
  });
  return data;
}
