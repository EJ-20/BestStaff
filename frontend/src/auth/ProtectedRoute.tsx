import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
  const { token, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div className="p-6 text-sm text-neutral-600">Loading…</div>;
  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />;
  return <Outlet />;
}
