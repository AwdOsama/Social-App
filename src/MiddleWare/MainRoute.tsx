import  { type ReactNode } from "react";

import { Navigate } from "react-router-dom";

export default function MainRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("TKN");

  if (token) {
    return <Navigate to="/feed" />;
  }
  return children;
}
