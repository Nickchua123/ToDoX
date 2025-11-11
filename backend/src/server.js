import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";
import xss from "xss";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import csurf from "csurf";
import dns from "dns";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

try {
  if (typeof dns.setDefaultResultOrder === "function") {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch {}

import authRoute from "./routes/authRouters.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import variantRoutes from "./routes/variantRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { connectDB } from "./config/db.js";

const app = express();

const PORT = process.env.PORT || 5001;
const isProd = process.env.NODE_ENV === "production";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const API_URL = process.env.API_URL || `http://localhost:${PORT}`;

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

const rawOrigins = process.env.CORS_ORIGINS || process.env.FRONTEND_URLS || FRONTEND_URL;
const ALLOWED_ORIGINS = String(rawOrigins)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOriginSet = new Set([
  ...ALLOWED_ORIGINS,
  FRONTEND_URL,
  API_URL,
].filter(Boolean));

const cookieSameSite = isProd ? "none" : "lax";


app.set("trust proxy", 1);

// Xss
app.use(express.json());
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key], {
          whiteList: {},
          stripIgnoreTag: true,
          stripIgnoreTagBody: ['script', 'style', 'iframe'],
          onTagAttr: (tag, name) => {
            if (name.match(/^on/i)) return '';
          },
        });
      }
    }
  }
  next();
});

app.use(
  mongoSanitize({
    replaceWith: "_", 
  })
);

app.use(cookieParser()); 

// Helmet
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
          styleSrc: ["'self'", "'unsafe-inline'"],
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

// CORS
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOriginSet.has(origin)) return cb(null, true);
      if (!isProd && /^https?:\/\/localhost(?::\d+)?$/.test(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS: " + origin), false);
    },
    credentials: true,
  })
);



// CSRF setup
const csrfProtection = csurf({
  cookie: {
    httpOnly: false, 
    sameSite: cookieSameSite,
    secure: isProd, 
  },
});

// CSRF
app.get("/api/auth/csrf-token", csrfProtection, (req, res) => {
  const token = req.csrfToken();
  res.cookie("XSRF-TOKEN", token, {
    httpOnly: false,
    sameSite: cookieSameSite,
    secure: isProd,
  });
  res.json({ csrfToken: token });
});

// Apply CSRF 
app.use("/api", (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  return csrfProtection(req, res, next);
});

// Public Routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes);

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







