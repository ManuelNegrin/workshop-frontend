import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function ProtectedRoute({ permission }) {
  const { user, loading, hasPermission } = useAuth();
  if (loading) return <div className="app-loading">Validando sesion...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.isPlatformAdmin) return <Navigate to="/platform" replace />;
  if (permission && !hasPermission(permission)) return <Navigate to="/" replace />;
  return <Outlet />;
}
