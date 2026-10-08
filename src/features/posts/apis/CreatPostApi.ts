import axios from "axios";

export async function AddPost(formData: FormData) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/posts`, formData, {
    headers: {
      Authorization: `Bearer ${token}




`,
    },
  });
  return data;
}
