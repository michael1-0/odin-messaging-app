import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
  return localStorage.getItem("token") ? <Outlet /> : <Navigate to="/login" replace />;
}

export function GuestRoute() {
  return localStorage.getItem("token") ? <Navigate to="/" replace /> : <Outlet />;
}
