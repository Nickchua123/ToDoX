import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { prepareCsrfHeaders } from "@/lib/csrf";

const AuthContext = createContext({
  user: null,
  loading: true,
  refreshAuth: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/auth/profile", { _skipAuthRedirect: true });
      setUser(data);
    } catch (err) {
      if (err?.response?.status === 401) {
        setUser(null);
      } else {
        toast.error(err?.response?.data?.message || "Không lấy được thông tin người dùng");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const logout = async () => {
    try {
      const headers = await prepareCsrfHeaders();
      await api.post("/auth/logout", null, { headers, _skipAuthRedirect: true });
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
