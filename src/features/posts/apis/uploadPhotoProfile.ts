import axios from "axios";

export async function uploadPhoto(file: File) {
  const token = localStorage.getItem("TKN");
  const formData = new FormData();
  formData.append("photo", file);
  const { data } = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/users/upload-photo`,
    formData,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}

export async function uploadCover(file: File) {
  const token = localStorage.getItem("TKN");
  const formData = new FormData();
  formData.append("cover", file);

  const { data } = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/users/upload-cover`,
    formData,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}