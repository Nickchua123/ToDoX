import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import Turnstile from "@/components/Turnstile";
import { Link } from "react-router-dom";

const inputClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-brand-primary/70 focus:outline-none transition bg-white/80";
const isValidEmail = (v = "") => /\S+@\S+\.\S+/.test(String(v).trim());

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(null);
  const emailOk = useMemo(() => isValidEmail(email), [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOk) return toast.warning("Email không hợp lệ");
    setLoading(true);
    try {
      const check = await api.post("/auth/check-email", { email });
      if (!check.data?.exists) {
        toast.error("Email chưa được đăng ký");
        setLoading(false);
        return;
      }
      const payload = { email };
      if (captcha) payload.turnstileToken = captcha;
      await api.post("/auth/forgot", payload);
      toast.success("Nếu email tồn tại, hướng dẫn đặt lại đã được gửi.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gửi yêu cầu thất bại");
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
              Quên mật khẩu
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">
                Email đăng ký
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold bg-brand-primary hover:bg-[#e5553d] transition disabled:opacity-70"
            >
              {loading ? "Đang gửi..." : "Gửi hướng dẫn đặt lại"}
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
            <Link
              to="/login"
              className="text-brand-primary font-medium hover:underline"
            >
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
