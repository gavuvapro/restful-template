import React, { createContext, useEffect, useState } from "react";
import api from "../services/api";

type User = { id: string; email: string; role: string } | null;

export const AuthContext = createContext<any>(null);

export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return setLoading(false);
    try {
      const res = await api.get("/auth/me");
      setCurrentUser(res.data.data.user);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", res.data.data.accessToken || res.data.accessToken || res.data.token);
    await loadUser();
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setCurrentUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout, isAuthenticated: !!currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
