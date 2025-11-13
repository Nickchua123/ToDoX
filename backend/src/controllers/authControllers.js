import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import crypto from "crypto";
import User from "../models/User.js";
import PendingRegistration from "../models/PendingRegistration.js";
import { sendMail } from "../utils/mailer.js";
import { isAdminUser } from "../middleware/admin.js";
// Kiểm tra độ mạnh mật khẩu
const isStrongPassword = (pwd) => {
  const s = String(pwd || "");
  if (s.length < 12) return false;
  return /[A-Z]/.test(s) && /\d/.test(s) && /[^A-Za-z0-9]/.test(s);
};
const normalizeUsername = (value, fallback = "") => {
  const base =
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || fallback;
  return base || `user${Date.now()}`;
};
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const isProd = process.env.NODE_ENV === "production";
// Dev (kể cả IP LAN): dùng SameSite=lax để cookie hoạt động qua HTTP
const cookieSameSite = isProd ? "none" : "lax";
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: cookieSameSite,
  secure: isProd,
};
const XSRF_COOKIE_OPTIONS = {
  httpOnly: false,
  sameSite: cookieSameSite,
  secure: isProd,
};
// Access/Refresh tokens
const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || "7d";
const getRefreshSecret = () => process.env.REFRESH_JWT_SECRET || process.env.JWT_SECRET;
const signAccessToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
const signRefreshToken = (id, ver = 0) => jwt.sign({ id, ver }, getRefreshSecret(), { expiresIn: REFRESH_TOKEN_TTL });
// Đăng ký với mã xác thực qua email
export const registerStart = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng cung cấp tên, email và mật khẩu" });
    }
    if (!isStrongPassword(password)) {
    if (!validator.isEmail(String(email))) { return res.status(400).json({ message: "Invalid email" }); }
      return res.status(400).json({ message: "Mật khẩu yếu. Yêu cầu tối thiểu 12 ký tự, có chữ hoa, số và ký tự đặc biệt" });
    }
    //Kiem tra ton tai email va ten dang nhap
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedUsername = normalizeUsername(name, normalizedEmail.split("@")[0]);
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) return res.status(400).json({ message: "Tên người dùng đã tồn tại" });
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại" });
    const now = new Date();
    const existingPending = await PendingRegistration.findOne({ email: normalizedEmail });
    if (existingPending && existingPending.lastSentAt && now - existingPending.lastSentAt < 60 * 1000) {
      return res.status(429).json({ message: "Vui lòng đợi 60 giây trước khi gửi lại mã" });
    }
    const passwordHash = await bcrypt.hash(String(password), 10);
    const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await PendingRegistration.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        name: String(name).trim(),
        username: normalizedUsername,
        passwordHash,
        codeHash,
        expiresAt,
        attempts: 0,
        lastSentAt: now,
      },
      { upsert: true }
    );
    try {
      await sendMail({
        to: normalizedEmail,
        subject: "Mã xác thực đăng ký Flow",
        text: `Mã xác thực của bạn là: ${code} (hết hạn sau 15 phút)`,
        html: `<!doctype html><html><head><meta charset="UTF-8"/></head><body>
               <p>Mã xác thực của bạn là:</p>
               <div style="font-size:24px;font-weight:700;background:#f0f4ff;display:inline-block;padding:8px 12px;border-radius:8px;letter-spacing:2px;">${code}</div>
               <p>Hết hạn sau 15 phút.</p>
               </body></html>`,
      });
    } catch (mailErr) {
      return res.status(500).json({ message: "Không gửi được email xác thực" });
    }
    return res.status(200).json({ message: "Đã gửi mã xác thực tới email" });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const registerVerify = async (req, res) => {
  try {
    const { email, code } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const safeCode = String(code || "").trim();
    if (!normalizedEmail || !safeCode) return res.status(400).json({ message: "Thiếu email hoặc mã" });
    if (!validator.isEmail(normalizedEmail)) return res.status(400).json({ message: "Email không hợp lệ" });
    const pending = await PendingRegistration.findOne({ email: normalizedEmail });
    if (!pending) return res.status(400).json({ message: "Không tìm thấy yêu cầu đăng ký" });
    if (pending.expiresAt < new Date()) return res.status(400).json({ message: "Mã đã hết hạn" });
    if (pending.attempts >= 5) return res.status(429).json({ message: "Quá số lần thử, vui lòng gửi lại mã", attemptsRemaining: 0 });
    const codeHash = crypto.createHash("sha256").update(safeCode).digest("hex");
    if (pending.codeHash !== codeHash) {
      pending.attempts += 1;
      await pending.save();
      return res.status(400).json({ message: "Mã không chính xác", attemptsRemaining: Math.max(0, 5 - pending.attempts) });
    }
    const baseUsername = pending.username || normalizeUsername(pending.name, normalizedEmail.split("@")[0]);
    let finalUsername = baseUsername;
    let suffix = 1;
    while (await User.exists({ username: finalUsername })) {
      finalUsername = `${baseUsername}-${suffix++}`;
    }
    const dupEmail = await User.exists({ email: normalizedEmail });
    if (dupEmail) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }
    const user = await User.create({
      name: pending.name,
      username: finalUsername,
      email: normalizedEmail,
      password: pending.passwordHash,
    });
    await PendingRegistration.deleteOne({ _id: pending._id });
    return res.status(201).json({ message: "Đăng ký thành công", userId: user._id });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const registerResend = async (req, res) => {
  try {
    const { email } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) return res.status(400).json({ message: "Thiếu email" });
    const pending = await PendingRegistration.findOne({ email: normalizedEmail });
    if (!pending) return res.status(400).json({ message: "Không tìm thấy yêu cầu đăng ký" });
    const now = new Date();
    if (pending.lastSentAt && now - pending.lastSentAt < 60 * 1000) {
      return res.status(429).json({ message: "Vui lòng đợi 60 giây trước khi gửi lại mã" });
    }
    const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");
    pending.codeHash = crypto.createHash("sha256").update(code).digest("hex");
    pending.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    pending.attempts = 0;
    pending.lastSentAt = now;
    await pending.save();
    try {
      await sendMail({
        to: normalizedEmail,
        subject: "Mã xác thực đăng ký Flow",
        text: `Mã xác thực của bạn là: ${code} (hết hạn sau 15 phút)`,
        html: `<!doctype html><html><head><meta charset="UTF-8"/></head><body>
               <p>Mã xác thực của bạn là:</p>
               <div style="font-size:24px;font-weight:700;background:#f0f4ff;display:inline-block;padding:8px 12px;border-radius:8px;letter-spacing:2px;">${code}</div>
               <p>Hết hạn sau 15 phút.</p>
               </body></html>`,
      });
    } catch (mailErr) {
      return res.status(500).json({ message: "Không gửi được email xác thực" });
    }
    return res.status(200).json({ message: "Đã gửi lại mã xác thực" });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
// Đăng nhập/ hồ sơ/ đăng xuất 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Thiếu thông tin đăng nhập" });
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu!" });
    const valid = await bcrypt.compare(String(password), user.password);
    if (!valid) return res.status(401).json({ message: "Sai mật khẩu" });
    const at = signAccessToken(user._id);const rt = signRefreshToken(user._id, user.tokenVersion || 0);    
    res.cookie(ACCESS_COOKIE, at, COOKIE_OPTIONS);
        res.cookie(REFRESH_COOKIE, rt, COOKIE_OPTIONS);
            try { res.clearCookie("token", COOKIE_OPTIONS); } catch {};
    try {
      if (typeof req.csrfToken === "function") {
        const xsrf = req.csrfToken();
        res.cookie("XSRF-TOKEN", xsrf, XSRF_COOKIE_OPTIONS);
      }
    } catch {}
    res.status(200).json({ message: "Đăng nhập thành công", userId: user._id });
  } catch (err) {res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
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
    const plain = user.toObject({ getters: true, virtuals: true });
    plain.isAdmin = await isAdminUser(userId);
    res.status(200).json(plain);
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};
export const logout = (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  try { res.clearCookie("access_token", COOKIE_OPTIONS); } catch {}
  try { res.clearCookie("refresh_token", COOKIE_OPTIONS); } catch {}
  res.clearCookie("XSRF-TOKEN", XSRF_COOKIE_OPTIONS);
  res.status(200).json({ message: "Đăng xuất thành công" });
};
// Quên/đặt lại mật khẩu
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ message: "Vui lòng nhập email" });
    }
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return res.status(200).json({ message: "Chúng tôi đã gửi hướng dẫn đặt lại. Vui lòng kiểm tra email của bạn." });
    }
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000);
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expires;
    await user.save();
    const resetUrl = `${FRONTEND_URL}/reset?token=${rawToken}`;
    try {
      await sendMail({
        to: normalizedEmail,
        subject: "Đặt lại mật khẩu Flow",
        text: `Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào liên kết sau (hết hạn sau 15 phút): ${resetUrl}`,
        html: `<!doctype html><html><head><meta charset=\"UTF-8\"/></head><body>
               <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
               <p><a href=\"${resetUrl}\">Bấm vào đây để đặt lại</a> (hết hạn sau 15 phút).</p>
               <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
               </body></html>`,
      });
    } catch (mailErr) {
    }
    return res.status(200).json({ message: "Chúng tôi đã gửi hướng dẫn đặt lại. Vui lòng kiểm tra email của bạn." });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body || {};
    // Align message with 12-char strong password policy
    if (token && !isStrongPassword(password)) {
      return res.status(400).json({ message: "Mật khẩu yếu. Yêu cầu tối thiểu 12 ký tự, có chữ hoa, số và ký tự đặc biệt" });
    }
    if (!token || !password) {
      return res.status(400).json({ message: "Thiếu token hoặc mật khẩu mới" });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "Mật khẩu yếu. Yêu cầu tối thiểu 12 ký tự, có chữ hoa, số và ký tự đặc biệt" });
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
    user.tokenVersion = (Number(user.tokenVersion) || 0) + 1;
    await user.save();
    return res.status(200).json({ message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập." });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
// ========== Tiện ích: kiểm tra tồn tại email (phục vụ UI) ==========
export const checkEmail = async (req, res) => {
  try {
    const normalizedEmail = String(req.body?.email || "").trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ message: "Thiếu email" });
    }
    const exists = await User.exists({ email: normalizedEmail });
    return res.status(200).json({ exists: !!exists });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const refresh = async (req, res) => {
  try {
    const rt = req.cookies?.[REFRESH_COOKIE];
    if (!rt) return res.status(401).json({ message: "Thiếu refresh token" });
    const decoded = jwt.verify(rt, getRefreshSecret());
    const user = await User.findById(decoded.id).select("_id tokenVersion");
    if (!user) return res.status(401).json({ message: "Refresh token không hợp lệ" });
    const ver = Number(decoded.ver || 0);
    if (Number(user.tokenVersion || 0) !== ver) {
      return res.status(401).json({ message: "Refresh token đã bị thu hồi" });
    }
    const at = signAccessToken(user._id);
    const newRt = signRefreshToken(user._id, user.tokenVersion || 0);
    res.cookie(ACCESS_COOKIE, at, COOKIE_OPTIONS);
    res.cookie(REFRESH_COOKIE, newRt, COOKIE_OPTIONS);
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(401).json({ message: "Refresh token không hợp lệ" });
  }
};


