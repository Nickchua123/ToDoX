// backend/src/middleware/turnstile.js
// Cloudflare Turnstile verification middleware

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(req, res, next) {
  try {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    // Allow bypass in development if no secret configured
    if (!secret) {
      console.warn("[Turnstile] TURNSTILE_SECRET_KEY not set. Skipping verification.");
      return next();
    }

    const token =
      req.body?.turnstileToken ||
      req.body?.["cf-turnstile-response"] ||
      req.headers["cf-turnstile-response"];

    if (!token) {
      return res.status(400).json({ message: "Thiếu xác thực CAPTCHA" });
    }

    // Prefer global fetch (Node 18+) if available
    const doFetch = typeof fetch === "function"
      ? fetch
      : (...args) => import("node-fetch").then(({ default: f }) => f(...args));

    const form = new URLSearchParams();
    form.set("secret", secret);
    form.set("response", token);
    const remoteip = req.ip || req.connection?.remoteAddress || undefined;
    if (remoteip) form.set("remoteip", remoteip);

    const r = await doFetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const data = await r.json().catch(() => ({}));

    if (!data?.success) {
      return res.status(403).json({ message: "CAPTCHA không hợp lệ", codes: data["error-codes"] || [] });
    }
    return next();
  } catch (err) {
    console.error("[Turnstile] Verification error:", err);
    return res.status(500).json({ message: "Lỗi xác thực CAPTCHA" });
  }
}

