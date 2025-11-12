import validator from "validator";
import User from "../models/User.js";

const sanitizeName = (name) => String(name || "").trim();

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -resetPasswordToken -resetPasswordExpires");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được thông tin", error: err.message });
  }
};

const normalizeProfilePayload = (body = {}) => {
  const update = {};
  if (body.name) {
    const normalized = sanitizeName(body.name);
    if (normalized.length < 2) throw new Error("Tên quá ngắn");
    update.name = normalized;
  }
  if (body.username) {
    const username = String(body.username || "").trim();
    if (username.length < 3) throw new Error("Username tối thiểu 3 ký tự");
    update.username = username;
  }
  if (body.phone) {
    const phone = String(body.phone || "").trim();
    if (phone && !validator.isMobilePhone(phone, "vi-VN")) {
      throw new Error("Số điện thoại không hợp lệ");
    }
    update.phone = phone || null;
  }
  if (body.gender) {
    const allowed = ["Nam", "Nữ", "Khác"];
    if (!allowed.includes(body.gender)) {
      throw new Error("Giới tính không hợp lệ");
    }
    update.gender = body.gender;
  }
  if (body.dateOfBirth) {
    const dob = new Date(body.dateOfBirth);
    if (Number.isNaN(dob.getTime())) throw new Error("Ngày sinh không hợp lệ");
    update.dateOfBirth = dob;
  }
  if (typeof body.avatar === "string") {
    update.avatar = body.avatar.trim();
  }
  if (typeof body.emailMarketing !== "undefined") {
    update.emailMarketing = Boolean(body.emailMarketing);
  }
  if (typeof body.smsMarketing !== "undefined") {
    update.smsMarketing = Boolean(body.smsMarketing);
  }
  if (typeof body.shareDataWithPartners !== "undefined") {
    update.shareDataWithPartners = Boolean(body.shareDataWithPartners);
  }
  return update;
};

export const updateMe = async (req, res) => {
  try {
    const update = normalizeProfilePayload(req.body);
    const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );
    res.json(user);
  } catch (err) {
    const message = err.message === "Tên quá ngắn"
      || err.message?.includes("không hợp lệ")
      ? err.message
      : "Không cập nhật được thông tin";
    res.status(message === err.message ? 400 : 500).json({ message });
  }
};

export const listUsers = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const query = {};
    if (q) {
      const rx = new RegExp(String(q).trim(), "i");
      query.$or = [{ name: rx }, { email: rx }];
    }
    const perPage = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * perPage;
    const [items, total] = await Promise.all([
      User.find(query).select("name email createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),
      User.countDocuments(query),
    ]);
    res.json({ total, page: Number(page) || 1, items });
  } catch (err) {
    res.status(500).json({ message: "Không lấy được danh sách người dùng", error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("name email createdAt");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được người dùng", error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const update = { ...normalizeProfilePayload(req.body) };
    if (req.body?.email) {
      if (!validator.isEmail(String(req.body.email))) return res.status(400).json({ message: "Email không hợp lệ" });
      update.email = String(req.body.email).trim().toLowerCase();
    }
    const user = await User.findByIdAndUpdate(req.params.userId, update, { new: true }).select(
      "username name email phone gender dateOfBirth avatar updatedAt"
    );
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (err) {
    const message =
      err.message === "Tên quá ngắn" ||
      err.message === "Username tối thiểu 3 ký tự" ||
      err.message?.includes("không hợp lệ")
        ? err.message
        : "Không cập nhật được người dùng";
    res.status(message === err.message ? 400 : 500).json({ message });
  }
};

export const requestDeleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { deleteRequestedAt: new Date() },
      { new: true }
    ).select("deleteRequestedAt");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({ message: "Đã ghi nhận yêu cầu xóa tài khoản", deleteRequestedAt: user.deleteRequestedAt });
  } catch (err) {
    res.status(500).json({ message: "Không gửi được yêu cầu xóa", error: err.message });
  }
};
