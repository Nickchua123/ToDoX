import express from "express";
import { registerStart, registerVerify, registerResend, login, profile, logout, forgotPassword, resetPassword, checkEmail } from "../controllers/authControllers.js";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../middleware/auth.js";
import { verifyTurnstile } from "../middleware/turnstile.js";

const router = express.Router();

// Gi?i h?n brute force login/register
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 ph�t
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      message: "Qu� nhi?u l?n dang nh?p th?t b?i, th? l?i sau!",
    });
  },
});

const registerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

// Gi?i h?n forgot password d? tr�nh l?m d?ng
const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration with verification code
router.post("/register/start", registerLimiter, verifyTurnstile, registerStart);
router.post("/register/verify", registerLimiter, registerVerify);
router.post("/register/resend", registerLimiter, verifyTurnstile, registerResend);
router.post("/check-email", registerLimiter, verifyTurnstile, checkEmail);

router.post("/login", loginLimiter, verifyTurnstile, login);
router.get("/profile", requireAuth, profile);
router.post("/logout", logout);
router.post("/forgot", forgotLimiter, verifyTurnstile, forgotPassword);
router.post("/reset", resetPassword);

export default router;
