import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Auth";

function UserLoginAuth({ children }) {
  const user = useAuth();
  if (user.userInfo) {
    return <Navigate to={"/home"} />;
  }

  return children;
}

export default UserLoginAuth;
