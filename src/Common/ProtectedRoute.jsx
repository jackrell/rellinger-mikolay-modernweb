// src/Common/ProtectedRoute.jsx

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentUser } from "./Services/AuthService";

export default function ProtectedRoute() {
  const user = getCurrentUser();
  const location = useLocation();

  // If not logged in, redirect to /auth with redirect param
  if (!user) {
    return <Navigate to={`/auth?redirect=${location.pathname}`} replace />;
  }

  return <Outlet />;
}
