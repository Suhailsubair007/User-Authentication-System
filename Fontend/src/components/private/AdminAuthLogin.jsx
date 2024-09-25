import React from "react";
import { useAdminAuth } from "./Auth";
import { Navigate } from "react-router-dom";

function adminAuthLogin({ children }) {
  const { adminInfo } = useAdminAuth(); // Destructuring adminInfo safely
  if (adminInfo) {
    return <Navigate to={"/admin/dashboard"} />;
  }
  return children;
}

export default adminAuthLogin;
