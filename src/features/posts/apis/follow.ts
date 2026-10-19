import axios from "axios";

export async function followUser(userId: string) {
  const token = localStorage.getItem("TKN");
  const { data } = await axios.put(
    `${import.meta.env.VITE_BASE_URL}/users/${userId}/follow`,
    null,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}