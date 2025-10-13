import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

const useQuery = () => new URLSearchParams(window.location.search);

const ResetPassword = () => {
  const query = useQuery();
  const token = useMemo(() => query.get("token") || "", [query]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.warning("Mật khẩu phải tối thiểu 8 ký tự");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset", { token, password });
      toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập.");
      window.location.href = "/login";
    } catch (err) {
      toast.error(err.response?.data?.message || "Đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fefcff]">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu mới"
            className="w-full border rounded-lg p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-3 rounded-xl text-white font-medium bg-primary hover:bg-primary-dark transition"
          >
            {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          <a href="/login" className="text-primary hover:underline">Quay lại đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;

