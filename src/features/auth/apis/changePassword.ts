import axios from "axios";

type Payload = { token: string; password: string; newPassword: string };

export async function changePassword({ token, password, newPassword }: Payload) {
  const { data } = await axios.patch(
    `${import.meta.env.VITE_BASE_URL}/users/change-password`,
    { password, newPassword },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}