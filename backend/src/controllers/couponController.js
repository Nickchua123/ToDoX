import Coupon from "../models/Coupon.js";

const normalizeCode = (code) => String(code || "").trim().toUpperCase();

export const listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được coupon", error: err.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, maxUses = 0, expiresAt, active = true } = req.body || {};
    if (!code || discountPercent == null) {
      return res.status(400).json({ message: "Thiếu mã hoặc phần trăm giảm" });
    }
    const normalized = normalizeCode(code);
    const exists = await Coupon.findOne({ code: normalized });
    if (exists) return res.status(409).json({ message: "Coupon đã tồn tại" });
    const coupon = await Coupon.create({
      code: normalized,
      discountPercent,
      maxUses,
      expiresAt,
      active,
    });
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: "Không tạo được coupon", error: err.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    if (update.code) update.code = normalizeCode(update.code);
    const coupon = await Coupon.findByIdAndUpdate(id, update, { new: true });
    if (!coupon) return res.status(404).json({ message: "Không tìm thấy coupon" });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: "Không cập nhật được coupon", error: err.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Coupon.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Không tìm thấy coupon" });
    res.json({ message: "Đã xóa coupon" });
  } catch (err) {
    res.status(500).json({ message: "Không xóa được coupon", error: err.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body || {};
    if (!code) return res.status(400).json({ message: "Thiếu mã giảm" });
    const normalized = normalizeCode(code);
    const coupon = await Coupon.findOne({ code: normalized });
    if (!coupon) return res.status(404).json({ message: "Coupon không tồn tại" });
    if (!coupon.active) return res.status(400).json({ message: "Coupon đã bị vô hiệu" });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: "Coupon đã hết hạn" });
    }
    if (coupon.maxUses && coupon.used >= coupon.maxUses) {
      return res.status(400).json({ message: "Coupon đã hết lượt dùng" });
    }
    res.json({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      expiresAt: coupon.expiresAt,
      remaining: coupon.maxUses ? coupon.maxUses - coupon.used : null,
    });
  } catch (err) {
    res.status(500).json({ message: "Không xác thực được coupon", error: err.message });
  }
};

