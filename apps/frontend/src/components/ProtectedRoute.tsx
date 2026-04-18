import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const API_WARMUP_KEY = "api-warmed";

function warmUpApiOnce() {
  if (sessionStorage.getItem(API_WARMUP_KEY)) {
    return;
  }

  sessionStorage.setItem(API_WARMUP_KEY, "1");
  void fetch(`${import.meta.env.VITE_API_URL}health`).catch(() => {
    // warm-up is best-effort and should not block route rendering
  });
}

export function ProtectedRoute() {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    warmUpApiOnce();

    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setIsValidating(false);
      return;
    }

    const checkToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}me`, {
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
      <div className="flex flex-1 items-center justify-center min-h-dvh">
        <p className="opacity-70">Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function GuestRoute() {
  useEffect(() => {
    warmUpApiOnce();
  }, []);

  return localStorage.getItem("token") ? (
    <Navigate to="/" replace />
  ) : (
    <Outlet />
  );
}
