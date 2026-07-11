/**
 * SentinelX AI — Protected Route Guard
 *
 * Wraps every authenticated route group. Waits for the auth store to
 * finish hydrating from localStorage before deciding, so a logged-in
 * officer never gets flashed to /login on a hard refresh.
 */
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const location = useLocation();

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sx-bg">
        <div className="flex items-center gap-2 text-sx-text-dim text-sm">
          <span className="h-2 w-2 rounded-full bg-sx-accent animate-pulse-slow" />
          Loading SentinelX AI…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
