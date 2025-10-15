import React, { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import Turnstile from "@/components/Turnstile";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Pre-check email existence (explicit UX)
      const checkPayload = { email };
      if (captcha) checkPayload.turnstileToken = captcha;
      const check = await api.post("/auth/check-email", checkPayload);
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

        <div className="mt-4">
          <Turnstile
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            onToken={setCaptcha}
            theme="auto"
          />
        </div>
        <p className="text-center text-sm mt-4">
          <a href="/login" className="text-primary hover:underline">Quay lại đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
