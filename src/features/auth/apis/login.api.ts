import axios from "axios";

type loginPayload = {
  email: string;
  password: string;
};

export async function SignIn(payload: loginPayload) {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/users/signin`,
    payload,
  );
  return data;
}
