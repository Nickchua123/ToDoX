import React, { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useNavigate } from "react-router";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      toast.warning("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fefcff]">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký tài khoản</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Tên người dùng"
            className="w-full border rounded-lg p-3"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border rounded-lg p-3"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            className="w-full border rounded-lg p-3"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-medium bg-primary hover:bg-primary-dark transition"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Đã có tài khoản?{" "}
          <a href="/login" className="text-primary hover:underline">
            Đăng nhập ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
