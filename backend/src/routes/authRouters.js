import express from "express";
import {  registerStart,registerVerify,registerResend, login, profile, logout, forgotPassword, resetPassword,checkEmail,refresh,changePassword,} from "../controllers/authControllers.js";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";
import { verifyTurnstile } from "../middleware/turnstile.js";

const router = express.Router();

// Giới hạn brute force login/register/forgot password
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 phút
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      message: "Quá nhiều lần đăng nhập thất bại, thử lại sau!",
    });
  },
});

const registerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register/start", registerLimiter, verifyTurnstile, registerStart);
router.post("/register/verify", registerLimiter, registerVerify);
router.post("/register/resend", registerLimiter, verifyTurnstile, registerResend);
router.post("/check-email", registerLimiter, checkEmail);

router.post("/login", loginLimiter, verifyTurnstile, login);
router.post("/refresh", refresh);
router.get("/profile", requireAuth, profile);
router.post("/logout", logout);
router.put("/change-password", requireAuth, changePassword);
router.post("/forgot", forgotLimiter, verifyTurnstile, forgotPassword);
router.post("/reset", resetPassword);

export default router;

