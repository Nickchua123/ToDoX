import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useNavigate, Link } from "react-router-dom";
import Turnstile from "@/components/Turnstile";
import { prepareCsrfHeaders } from "@/lib/csrf";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/70 focus:outline-none transition bg-white/80";
const isValidEmail = (v = "") => /\S+@\S+\.\S+/.test(String(v).trim());
const strongPwd = (pwd = "") =>
  String(pwd).length >= 12 &&
  /[A-Z]/.test(pwd) &&
  /\d/.test(pwd) &&
  /[^A-Za-z0-9]/.test(pwd);

const LoginPage = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const emailOk = useMemo(() => isValidEmail(formData.email), [formData.email]);
  const pwdOk = useMemo(
    () => strongPwd(formData.password),
    [formData.password]
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOk) {
      toast.warning("Email không hợp lệ");
      return;
    }
    if (!pwdOk) {
      toast.warning(
        "Mật khẩu yếu. Yêu cầu tối thiểu 12 ký tự, có chữ hoa, số và ký tự đặc biệt"
      );
      return;
    }
    setLoading(true);
    try {
      const headers = await prepareCsrfHeaders();
      const payload = { ...formData };
      if (captcha) payload.turnstileToken = captcha;
      await api.post("/auth/login", payload, {
        withCredentials: true,
        headers,
      });
      const profile = await refreshAuth();
      toast.success("Đăng nhập thành công!");
      const storedRedirect = (() => {
        try {
          const value = sessionStorage.getItem("postLoginRedirect");
          sessionStorage.removeItem("postLoginRedirect");
          return value;
        } catch {
          return null;
        }
      })();
      const isAdmin = Boolean(
        profile?.isAdmin ||
          profile?.role === "admin" ||
          profile?.role === "staff"
      );
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else if (storedRedirect) {
        navigate(storedRedirect, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Sai tài khoản hoặc mật khẩu!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f0] via-white to-[#fefcff] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur border border-orange-100 shadow-xl rounded-3xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-brand-dark">
              Đăng nhập
            </h1>
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
              <label className="text-sm font-medium text-gray-600">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
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
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {!pwdOk && formData.password && (
                <p className="text-xs text-red-500">
                  Mật khẩu cần tối thiểu 12 ký tự, có chữ hoa, số và ký tự đặc
                  biệt.
                </p>
              )}
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
              <Link
                to="/register"
                className="text-brand-primary font-medium hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
            <p>
              <Link
                to="/forgot"
                className="text-brand-primary font-medium hover:underline"
              >
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
