// backend/src/controllers/authControllers.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Task from "../models/Task.js";
import { sendMail } from "../utils/mailer.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const isProd = process.env.NODE_ENV === "production";
const isLocalDev = !isProd && /^http:\/\/localhost(?::\d+)?$/.test(FRONTEND_URL);
const cookieSameSite = isLocalDev ? "lax" : "none";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: cookieSameSite,
  secure: isProd,
};

const XSRF_COOKIE_OPTIONS = {
  httpOnly: false, // readable by client (axios sets header)
  sameSite: cookieSameSite,
  secure: isProd,
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng cung cấp tên, email và mật khẩu" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashed = await bcrypt.hash(String(password), 10);
    const newUser = await User.create({ name: String(name).trim(), email: normalizedEmail, password: hashed });

    try {
      if (typeof req.csrfToken === "function") {
        const xsrf = req.csrfToken();
        res.cookie("XSRF-TOKEN", xsrf, XSRF_COOKIE_OPTIONS);
      }
    } catch {}

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
    res.cookie("token", token, COOKIE_OPTIONS);

    try {
      if (typeof req.csrfToken === "function") {
        const xsrf = req.csrfToken();
        res.cookie("XSRF-TOKEN", xsrf, XSRF_COOKIE_OPTIONS);
      }
    } catch {}

    res.status(200).json({ message: "Đăng nhập thành công", userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
  }
};

export const profile = async (req, res) => {
  try {
    let userId = req.userId;
    if (!userId) {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    const [activeCount, completeCount] = await Promise.all([
      Task.countDocuments({ user: userId, status: "active" }),
      Task.countDocuments({ user: userId, status: "complete" }),
    ]);

    res.status(200).json({ ...user.toObject(), activeCount, completeCount });
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.clearCookie("XSRF-TOKEN", XSRF_COOKIE_OPTIONS);
  res.status(200).json({ message: "Đã đăng xuất" });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ message: "Vui lòng nhập email" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    // Đáp ứng giống nhau để tránh lộ diện email
    if (!user) {
      return res.status(200).json({ message: "Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại." });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expires;
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset?token=${rawToken}`;

    // Gửi email đặt lại mật khẩu
    try {
      await sendMail({
        to: normalizedEmail,
        subject: "Đặt lại mật khẩu ToDoX",
        text: `Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào liên kết sau (hết hạn sau 15 phút): ${resetUrl}`,
        html: `<p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
               <p><a href="${resetUrl}">Bấm vào đây để đặt lại</a> (hết hạn sau 15 phút).</p>
               <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>`,
      });
    } catch (mailErr) {
      console.error("Failed to send reset email:", mailErr);
      // Vẫn trả 200 để tránh lộ diện email tồn tại
    }

    return res.status(200).json({ message: "Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Thiếu token hoặc mật khẩu mới" });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: "Mật khẩu phải tối thiểu 8 ký tự" });
    }

    const hashedToken = crypto.createHash("sha256").update(String(token)).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    user.password = await bcrypt.hash(String(password), 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({ message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
