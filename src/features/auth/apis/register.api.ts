import axios from "axios";

type registerPayload = {
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female";
  password: string;
  rePassword: string;
};

export async function SignUp(payload: registerPayload) {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/users/signup`,
    payload,
  );
  return data;
}
