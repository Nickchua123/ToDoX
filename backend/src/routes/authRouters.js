import express from "express";
import { register, login, profile, logout } from "../controllers/authControllers.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Giới hạn brute force login
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 phút
  max: 5,
  message: "Quá nhiều lần đăng nhập thất bại, thử lại sau!",
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/profile", profile);
router.post("/logout", logout);

export default router;
