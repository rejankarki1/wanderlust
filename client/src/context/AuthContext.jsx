import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch("/api/me");
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials) => {
    const data = await apiFetch("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setUser(data.user);
    return data.user;
  };

  const signup = async (credentials) => {
    const data = await apiFetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await apiFetch("/api/logout", { method: "POST" });
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, refreshUser }),
    [user, loading, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
