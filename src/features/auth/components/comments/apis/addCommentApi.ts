import axios from "axios";

export async function addComment({postId, formData}: {postId: string, formData: FormData}) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments`,
    formData,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}
 