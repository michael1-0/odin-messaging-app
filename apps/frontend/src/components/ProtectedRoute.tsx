import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setIsValidating(false);
      return;
    }

    const checkToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}health`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Token expired or invalid");
        }

        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    checkToken();
  }, []);

  if (isValidating) {
    return (
      <div className="flex flex-1 items-center justify-center h-screen">
        <p className="opacity-70">Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function GuestRoute() {
  return localStorage.getItem("token") ? <Navigate to="/" replace /> : <Outlet />;
}
