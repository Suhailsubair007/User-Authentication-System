import React from "react";
import { useAuth } from "./Auth";
import { Navigate } from "react-router-dom";

function UserAuth({ children }) {
  const user = useAuth(); 
  if (!user.userInfo) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default UserAuth;
