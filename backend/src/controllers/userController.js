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

export const updateMe = async (req, res) => {
  try {
    const { name } = req.body || {};
    if (name && sanitizeName(name).length < 2) {
      return res.status(400).json({ message: "Tên quá ngắn" });
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { ...(name ? { name: sanitizeName(name) } : {}) },
      { new: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Không cập nhật được thông tin", error: err.message });
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
    const { name, email } = req.body || {};
    const update = {};
    if (name) {
      if (sanitizeName(name).length < 2) return res.status(400).json({ message: "Tên quá ngắn" });
      update.name = sanitizeName(name);
    }
    if (email) {
      if (!validator.isEmail(String(email))) return res.status(400).json({ message: "Email không hợp lệ" });
      update.email = String(email).trim().toLowerCase();
    }
    const user = await User.findByIdAndUpdate(req.params.userId, update, { new: true }).select(
      "name email updatedAt"
    );
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Không cập nhật được người dùng", error: err.message });
  }
};
