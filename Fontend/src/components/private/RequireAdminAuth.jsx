import React from "react";
import { useAdminAuth } from "./Auth";
import { Navigate } from "react-router-dom";

function RequireAdminAuth({ children }) {
  const { adminInfo } = useAdminAuth(); 
  if (!adminInfo) {
    return <Navigate to={"/adminLogin"} />;
  }
  return children;
}

export default RequireAdminAuth;
