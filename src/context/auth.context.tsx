import { createContext, useState } from "react";

type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  photo: string;
  cover: string;
};

type propsPage = {
  isLogin: null | string;
  setisLogin: React.Dispatch<React.SetStateAction<null | string>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const authContext = createContext<propsPage | null>(null);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogin, setisLogin] = useState<null | string>(() => {
    return localStorage.getItem("TKN");
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  return (
    <authContext.Provider value={{ isLogin, setisLogin, user, setUser }}>
      {children}
    </authContext.Provider>
  );
}
