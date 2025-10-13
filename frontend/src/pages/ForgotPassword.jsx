import React, { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot", { email });
      toast.success("Nếu email tồn tại, hướng dẫn đặt lại đã được gửi.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gửi yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fefcff]">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Quên mật khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email đã đăng ký"
            className="w-full border rounded-lg p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-medium bg-primary hover:bg-primary-dark transition"
          >
            {loading ? "Đang gửi..." : "Gửi hướng dẫn đặt lại"}
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          <a href="/login" className="text-primary hover:underline">Quay lại đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

