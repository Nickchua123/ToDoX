import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import csurf from "csurf";
import dns from "dns";

// Resolve dirname for ES modules and load .env from backend/.env explicitly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
// Prefer IPv4 first to avoid IPv6 SMTP/connectivity issues on some hosts
try {
  if (typeof dns.setDefaultResultOrder === "function") {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch {}

import authRoute from "./routes/authRouters.js";
import taskRoute from "./routes/tasksRouters.js";
import projectRoute from "./routes/projectsRouters.js";
import pomodoroRoute from "./routes/pomodoroRouters.js";
import eventsRoute from "./routes/eventsRouters.js";
import { connectDB } from "./config/db.js";

const app = express();

const PORT = process.env.PORT || 5001;
const isProd = process.env.NODE_ENV === "production";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const API_URL = process.env.API_URL || `http://localhost:${PORT}`;
// Fail-fast for required secrets/env to avoid vague 500s later
if (!process.env.JWT_SECRET) {
  console.error("[BOOT] Missing JWT_SECRET. Set it in backend/.env or deployment env.");
  process.exit(1);
}
if (!process.env.MONGODB_CONNECTIONSTRING) {
  console.error("[BOOT] Missing MONGODB_CONNECTIONSTRING. Set it in backend/.env or deployment env.");
  process.exit(1);
}
if (!process.env.REFRESH_JWT_SECRET) {
  console.warn("[BOOT] REFRESH_JWT_SECRET not set. Falling back to JWT_SECRET for refresh tokens.");
}

// Allow multiple origins via env (comma-separated)
// Prefer CORS_ORIGINS, then FRONTEND_URLS, then FRONTEND_URL
const rawOrigins = process.env.CORS_ORIGINS || process.env.FRONTEND_URLS || FRONTEND_URL;
const ALLOWED_ORIGINS = String(rawOrigins)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
// Build a set including API_URL and FRONTEND_URL for convenience
const allowedOriginSet = new Set([
  ...ALLOWED_ORIGINS,
  FRONTEND_URL,
  API_URL,
].filter(Boolean));
// In development over LAN/IP, set SameSite=lax to avoid browsers rejecting non-secure None cookies
const cookieSameSite = isProd ? "none" : "lax";

// Trust proxy (needed when behind reverse proxies for secure cookies)
app.set("trust proxy", 1);

// ===== Middlewares (order matters) =====
app.use(express.json()); // parse JSON body (must be before xss)
app.use(xss()); // sanitize input to mitigate XSS

// protect against NoSQL injection - replace dangerous chars with '_'
app.use(
  mongoSanitize({
    replaceWith: "_", // replaces $ and . with '_' in keys
  })
);

app.use(cookieParser()); // parse cookies (required by csurf)

// Helmet: stricter CSP in production (avoid 'unsafe-inline' in prod)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: (() => {
        const connectSources = Array.from(
          new Set(["'self'", ...ALLOWED_ORIGINS, FRONTEND_URL, API_URL].filter(Boolean))
        );
        const base = {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "https://challenges.cloudflare.com"],
          styleSrc: isProd ? ["'self'"] : ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          connectSrc: connectSources,
          frameSrc: ["'self'", "https://challenges.cloudflare.com"],
        };
        return base;
      })(),
    },
    hsts: isProd
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
  })
);

// CORS: allow frontend origin from env and allow cookies
app.use(
  cors({
    origin: (origin, cb) => {
      // Non-browser requests or same-origin XHR without Origin header
      if (!origin) return cb(null, true);
      // Allow configured origins (including API_URL/FRONTEND_URL)
      if (allowedOriginSet.has(origin)) return cb(null, true);
      // In development, allow any localhost origin to simplify local testing
      if (!isProd && /^https?:\/\/localhost(?::\d+)?$/.test(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS: " + origin), false);
    },
    credentials: true,
  })
);

// Rate limiting is handled in authRouters.js per endpoint

// CSRF setup: cookie-based token (client-readable XSRF cookie)
const csrfProtection = csurf({
  cookie: {
    httpOnly: false, // client JS may read this cookie
    sameSite: cookieSameSite,
    secure: isProd, // secure only in production (HTTPS)
  },
});

// Expose a token route that runs csrfProtection to generate token
app.get("/api/auth/csrf-token", csrfProtection, (req, res) => {
  const token = req.csrfToken();
  res.cookie("XSRF-TOKEN", token, {
    httpOnly: false,
    sameSite: cookieSameSite,
    secure: isProd,
  });
  res.json({ csrfToken: token });
});

// Apply CSRF protection only for state-changing requests under /api
app.use("/api", (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  return csrfProtection(req, res, next);
});

// Public Routes
app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/projects", projectRoute);
app.use("/api/pomodoro", pomodoroRoute);
app.use("/api/events", eventsRoute);

// ===== Serve frontend (also in dev if dist exists) =====
const distPath = path.join(__dirname, "../../frontend/dist");
const hasDist = fs.existsSync(distPath);
if (isProd || hasDist) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ===== CSRF and generic error handlers (after routes) =====
app.use((err, req, res, next) => {
  if (err && err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ message: "CSRF token không hợp lệ" });
  }
  return next(err);
});

// Optional generic error logger/response
app.use((err, req, res, next) => {
  console.error(err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
  }
});

// ===== Start server after DB connection =====
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server đang chạy tại cổng ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Kết nối DB thất bại:", err);
    process.exit(1);
  });






