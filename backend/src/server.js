import "./loadEnv.js";
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
import uploadRoutes from "./routes/uploadRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import shippingRoutes from "./routes/shippingRoutes.js";
import { connectDB } from "./config/db.js";
import { seedAdminUser } from "./utils/seedAdminUser.js";
import { startAccountDeletionJob } from "./utils/accountDeletionJob.js";

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

// Allow serving external assets (e.g., Cloudinary) when CSP is applied
const assetOrigins = String(process.env.ASSET_ORIGINS || "https://res.cloudinary.com")
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
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://challenges.cloudflare.com"],
          imgSrc: ["'self'", "data:", ...assetOrigins],
          fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
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

// Các đường dẫn bỏ qua CSRF (giảm ma sát đăng nhập; vẫn yêu cầu cookie)
const CSRF_EXEMPT_PATHS = new Set([
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/refresh",
]);

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
  if (CSRF_EXEMPT_PATHS.has(req.path)) return next();
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
app.use("/api/uploads", uploadRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/shipping", shippingRoutes);

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
  .then(async () => {
    await seedAdminUser();
    startAccountDeletionJob();
    app.listen(PORT, () => {
      console.log(`✅ Server đang chạy tại cổng ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Kết nối DB thất bại:", err);
    process.exit(1);
  });







