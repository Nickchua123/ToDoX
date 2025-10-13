import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import csurf from "csurf";
import rateLimit from "express-rate-limit";

import authRoute from "./routes/authRouters.js";
import taskRoute from "./routes/tasksRouters.js";
import { connectDB } from "./config/db.js";

const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT || 5001;
const isProd = process.env.NODE_ENV === "production";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const isLocalDev = !isProd && /^http:\/\/localhost(?::\d+)?$/.test(FRONTEND_URL);
const cookieSameSite = isLocalDev ? "lax" : "none";

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
      directives: isProd
        ? {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: [
              "'self'",
              process.env.FRONTEND_URL || "http://localhost:5173",
              process.env.API_URL || "http://localhost:5001",
            ],
          }
        : {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: [
              "'self'",
              process.env.FRONTEND_URL || "http://localhost:5173",
              process.env.API_URL || "http://localhost:5001",
            ],
          },
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
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// Rate limiter for auth endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

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

// ===== Routes =====
app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRoute);

// ===== Serve frontend when in production =====
if (isProd) {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
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
