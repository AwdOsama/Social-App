import axios from "axios";

export async function getMyPosts(userId: string) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_URL}/users/${userId}/posts`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}