import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import Turnstile from "@/components/Turnstile";

const useQuery = () => new URLSearchParams(window.location.search);

const VerifyCode = () => {
  const query = useQuery();
  const email = useMemo(() => query.get("email") || "", [query]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [captcha, setCaptcha] = useState(null);

  useEffect(() => {
    const key = `register:otp:last:${email}`;
    try {
      const last = Number(localStorage.getItem(key) || 0);
      const now = Date.now();
      const remain = Math.max(0, 60 - Math.floor((now - last) / 1000));
      setCooldown(remain);
    } catch {}
  }, [email]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      toast.warning("Vui lòng nhập mã 6 số");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/register/verify", { email, code });
      toast.success("Xác thực thành công. Vui lòng đăng nhập.");
      window.location.href = "/login";
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      const remain = err.response?.data?.attemptsRemaining;
      if (typeof remain === "number") {
        setAttemptsLeft(remain);
      } else {
        setAttemptsLeft((prev) => Math.max(0, prev - 1));
      }
      toast.error(serverMsg || "Mã không chính xác");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const payload = { email };
      if (captcha) payload.turnstileToken = captcha;
      await api.post("/auth/register/resend", payload);
      toast.success("Đã gửi lại mã xác thực");
      try {
        const key = `register:otp:last:${email}`;
        localStorage.setItem(key, String(Date.now()));
      } catch {}
      setCooldown(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gửi lại mã thất bại");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fefcff]">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center">Xác thực email</h2>
        <p className="text-sm text-center text-muted-foreground mb-6">
          Mã đã gửi tới: <span className="font-medium">{email}</span>
        </p>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="Nhập mã 6 số"
            className="w-full border rounded-lg p-3 text-center tracking-widest"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
            required
          />
          <p className="text-center text-sm text-muted-foreground">
            Bạn còn <span className="font-semibold">{attemptsLeft}</span> lần
            thử.
          </p>
          <button
            type="submit"
            disabled={loading || attemptsLeft === 0}
            className="w-full py-3 rounded-xl text-white font-medium bg-primary hover:bg-primary-dark transition"
          >
            {loading
              ? "Đang xác thực..."
              : attemptsLeft === 0
              ? "Hết lượt thử"
              : "Xác thực"}
          </button>
        </form>
        <button
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="w-full py-2 mt-3 rounded-xl font-medium border hover:bg-slate-50 transition"
        >
          {resending
            ? "Đang gửi lại..."
            : cooldown > 0
            ? `Gửi lại mã (${cooldown}s)`
            : "Gửi lại mã"}
        </button>
        <div className="mt-4">
          <Turnstile
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            onToken={setCaptcha}
            theme="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
