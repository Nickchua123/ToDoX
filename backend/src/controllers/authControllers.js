// backend/src/controllers/authControllers.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
};

const XSRF_COOKIE_OPTIONS = {
  httpOnly: false, // must be readable by client JS (axios xsrfCookieName)
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng cung cấp tên, email và mật khẩu" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashed = await bcrypt.hash(String(password), 10);
    const newUser = await User.create({ name: String(name).trim(), email: normalizedEmail, password: hashed });

    // If csurf is mounted and req.csrfToken exists, set XSRF cookie so client has token
    try {
      if (typeof req.csrfToken === "function") {
        const xsrf = req.csrfToken();
        res.cookie("XSRF-TOKEN", xsrf, XSRF_COOKIE_OPTIONS);
      }
    } catch (err) {
      // ignore if csurf not available
    }

    res.status(201).json({ message: "Đăng ký thành công", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Thiếu thông tin đăng nhập" });

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại" });

    const valid = await bcrypt.compare(String(password), user.password);
    if (!valid) return res.status(401).json({ message: "Sai mật khẩu" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Set JWT cookie (HttpOnly)
    res.cookie("token", token, COOKIE_OPTIONS);

    // If csurf is active, set a readable XSRF cookie for axios to pick up
    try {
      if (typeof req.csrfToken === "function") {
        const xsrf = req.csrfToken();
        res.cookie("XSRF-TOKEN", xsrf, XSRF_COOKIE_OPTIONS);
      }
    } catch (err) {
      // ignore if csrf not available
    }

    res.status(200).json({ message: "Đăng nhập thành công", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
  }
};

export const profile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    res.status(200).json(user);
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

export const logout = (req, res) => {
  // Clear JWT cookie and XSRF cookie
  res.clearCookie("token", COOKIE_OPTIONS);
  res.clearCookie("XSRF-TOKEN", XSRF_COOKIE_OPTIONS);
  res.status(200).json({ message: "Đã đăng xuất" });
};
