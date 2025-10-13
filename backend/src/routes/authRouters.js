import express from "express";
import { register, login, profile, logout, forgotPassword, resetPassword } from "../controllers/authControllers.js";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Giới hạn brute force login
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 phút
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res /* , next */) => {
    return res.status(429).json({
      message: "Quá nhiều lần đăng nhập thất bại, thử lại sau!",
    });
  },
});

// Giới hạn forgot password để tránh lạm dụng
const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/profile", requireAuth, profile);
router.post("/logout", logout);
router.post("/forgot", forgotLimiter, forgotPassword);
router.post("/reset", resetPassword);

export default router;
