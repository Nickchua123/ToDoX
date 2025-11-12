import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { prepareCsrfHeaders } from "@/lib/csrf";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/auth/profile", { _skipAuthRedirect: true });
      setUser(data);
      return data;
    } catch (err) {
      if (err?.response?.status === 401) {
        setUser(null);
      } else {
        toast.error(err?.response?.data?.message || "Không lấy được thông tin người dùng");
      }
      return null;
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
    } catch (err) {
      console.warn("Logout request failed", err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
