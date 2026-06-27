import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Guards routes by auth state and (optionally) role.
// Usage: <ProtectedRoute role="food-partner"><Dashboard/></ProtectedRoute>
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, role: currentRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-ink)] text-white/70">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    const loginPath = role === "food-partner" ? "/food-partner/login" : "/user/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (role && currentRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
