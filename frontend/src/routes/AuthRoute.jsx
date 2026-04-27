import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router";

const AuthRoute = () => {
  let location = useLocation();
  const token = useSelector((state) => state.auth.accessToken);
  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default AuthRoute;
