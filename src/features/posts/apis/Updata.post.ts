import axios from "axios";

export async function updatePost({ id, formData }: { id: string; formData: FormData }) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.put(`${import.meta.env.VITE_BASE_URL}/posts/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
}