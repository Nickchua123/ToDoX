import React, { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useNavigate, Link } from "react-router-dom";
import Turnstile from "@/components/Turnstile";
import { prepareCsrfHeaders } from "@/lib/csrf";
import { useAuth } from "@/contexts/AuthContext";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/70 focus:outline-none transition";

const LoginPage = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const headers = await prepareCsrfHeaders();
      const payload = { ...formData };
      if (captcha) payload.turnstileToken = captcha;
      await api.post("/auth/login", payload, { withCredentials: true, headers });
      await refreshAuth();
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sai tài khoản hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f0] via-white to-[#fefcff] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur border border-orange-100 shadow-xl rounded-3xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold tracking-[0.4em] text-gray-400">ND STYLE</p>
            <h1 className="text-3xl font-semibold text-brand-dark">Chào mừng trở lại</h1>
            <p className="text-sm text-gray-500">Đăng nhập để trải nghiệm các ưu đãi mới nhất</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className={inputClass}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Mật khẩu</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                className={inputClass}
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="text-right text-sm">
              <Link to="/forgot" className="text-brand-primary hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold bg-brand-primary hover:bg-[#e5553d] transition disabled:opacity-70"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="border-t pt-4">
            <Turnstile
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onToken={setCaptcha}
              theme="light"
            />
          </div>

          <div className="text-center text-sm text-gray-600 space-y-2">
            <p>
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-brand-primary font-medium hover:underline">
                Đăng ký ngay
              </Link>
            </p>
            <p>
              <Link to="/forgot" className="text-brand-primary font-medium hover:underline">
                Quên mật khẩu?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
