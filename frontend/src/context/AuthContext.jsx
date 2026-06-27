import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

// Holds the current auth state, bootstrapped from the httpOnly cookie via
// GET /api/auth/me so a refresh keeps the user logged in.
export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(null); // the user OR food partner object
  const [role, setRole] = useState(null); // "user" | "food-partner" | null
  const [loading, setLoading] = useState(true);

  const bootstrap = async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setRole(data.role);
      setAccount(data.user || data.foodPartner || null);
    } catch {
      setRole(null);
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  // Called by auth pages after a successful login/register response.
  const setSession = (nextRole, nextAccount) => {
    setRole(nextRole);
    setAccount(nextAccount);
  };

  const logout = async () => {
    const path =
      role === "food-partner"
        ? "/api/auth/food-partner/logout"
        : "/api/auth/user/logout";
    try {
      await api.get(path);
    } finally {
      setRole(null);
      setAccount(null);
    }
  };

  const value = {
    account,
    role,
    loading,
    isAuthenticated: Boolean(role),
    setSession,
    logout,
    refresh: bootstrap,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
