import { createContext, use, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

// Holds the current auth state, bootstrapped from the httpOnly cookie via
// GET /api/auth/me so a refresh keeps the user logged in.
export const AuthProvider = ({ children }) => {
  const [account, setAccount] = useState(null); // the user OR food partner object
  const [role, setRole] = useState(null); // "user" | "food-partner" | null
  const [loading, setLoading] = useState(true);

  const bootstrap = async () => {
    const token = localStorage.getItem("bitesized_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    try {
      const { data } = await api.get("/api/auth/me");
      setRole(data.role);
      setAccount(data.user || data.foodPartner || null);
    } catch {
      localStorage.removeItem("bitesized_token");
      delete api.defaults.headers.common["Authorization"];
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
  const setSession = (nextRole, nextAccount, token) => {
    setRole(nextRole);
    setAccount(nextAccount);
    if (token) {
      localStorage.setItem("bitesized_token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  };

  const logout = async () => {
    const path =
      role === "food-partner"
        ? "/api/auth/food-partner/logout"
        : "/api/auth/user/logout";
    try {
      await api.get(path);
    } finally {
      localStorage.removeItem("bitesized_token");
      delete api.defaults.headers.common["Authorization"];
      setRole(null);
      setAccount(null);
    }
  };

  // Update the logged-in user's profile (name / phone / address).
  const updateProfile = async (updates) => {
    const { data } = await api.patch("/api/auth/user/profile", updates);
    setAccount(data.user);
    return data.user;
  };

  // Permanently delete the logged-in user's account.
  const deleteAccount = async () => {
    await api.delete("/api/auth/user");
    setRole(null);
    setAccount(null);
  };

  const value = {
    account,
    role,
    loading,
    isAuthenticated: Boolean(role),
    setSession,
    logout,
    updateProfile,
    deleteAccount,
    refresh: bootstrap,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
