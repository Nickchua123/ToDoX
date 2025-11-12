import React, { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useNavigate, Link } from "react-router-dom";
import Turnstile from "@/components/Turnstile";
import { Eye, EyeOff } from "lucide-react";
import { prepareCsrfHeaders } from "@/lib/csrf";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/70 focus:outline-none transition";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
      const payload = { ...formData };
      if (captcha) payload.turnstileToken = captcha;
      const headers = await prepareCsrfHeaders();
      await api.post("/auth/register/start", payload, { headers });
      toast.success("Đã gửi mã xác thực đến email.");
      try {
        localStorage.setItem(`register:otp:last:${formData.email}`, String(Date.now()));
      } catch (storageErr) {
        console.warn("Không thể lưu timestamp OTP", storageErr);
      }
      navigate(`/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f0] via-white to-[#fefcff] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="bg-white/90 backdrop-blur border border-orange-100 shadow-xl rounded-3xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold tracking-[0.4em] text-gray-400">ND STYLE</p>
            <h1 className="text-3xl font-semibold text-brand-dark">Tạo tài khoản mới</h1>
            <p className="text-sm text-gray-500">Nhận ưu đãi độc quyền và theo dõi đơn hàng dễ dàng</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Tên người dùng</label>
              <input
                type="text"
                name="name"
                placeholder="Nguyễn Văn A"
                className={inputClass}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Ít nhất 8 ký tự"
                  className={`${inputClass} pr-10`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">Yêu cầu tối thiểu 12 ký tự, có chữ hoa, số và ký tự đặc biệt.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold bg-brand-primary hover:bg-[#e5553d] transition disabled:opacity-70"
            >
              {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
            </button>
          </form>

          <div className="border-t pt-4">
            <Turnstile
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onToken={setCaptcha}
              theme="light"
            />
          </div>

          <p className="text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-brand-primary font-medium hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
