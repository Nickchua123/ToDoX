import Coupon from "../models/Coupon.js";

const normalizeCode = (code) => String(code || "").trim().toUpperCase();

export const listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng láº¥y Ä‘Æ°á»£c coupon", error: err.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercent, maxUses = 0, expiresAt, active = true } = req.body || {};
    if (!code || discountPercent == null) {
      return res.status(400).json({ message: "Thiáº¿u mÃ£ hoáº·c pháº§n trÄƒm giáº£m" });
    }
    const normalized = normalizeCode(code);
    const exists = await Coupon.findOne({ code: normalized });
    if (exists) return res.status(409).json({ message: "Coupon Ä‘Ã£ tá»“n táº¡i" });
    const coupon = await Coupon.create({
      code: normalized,
      discountPercent,
      maxUses,
      expiresAt,
      active,
    });
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng táº¡o Ä‘Æ°á»£c coupon", error: err.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    if (update.code) update.code = normalizeCode(update.code);
    const coupon = await Coupon.findByIdAndUpdate(id, update, { new: true });
    if (!coupon) return res.status(404).json({ message: "KhÃ´ng tÃ¬m tháº¥y coupon" });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng cáº­p nháº­t Ä‘Æ°á»£c coupon", error: err.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Coupon.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "KhÃ´ng tÃ¬m tháº¥y coupon" });
    res.json({ message: "ÄÃ£ xÃ³a coupon" });
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng xÃ³a Ä‘Æ°á»£c coupon", error: err.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body || {};
    if (!code) return res.status(400).json({ message: "Thiáº¿u mÃ£ giáº£m" });
    const normalized = normalizeCode(code);
    const coupon = await Coupon.findOne({ code: normalized });
    if (!coupon) return res.status(404).json({ message: "Coupon khÃ´ng tá»“n táº¡i" });
    if (!coupon.active) return res.status(400).json({ message: "Coupon Ä‘Ã£ bá»‹ vÃ´ hiá»‡u" });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: "Coupon Ä‘Ã£ háº¿t háº¡n" });
    }
    if (coupon.maxUses && coupon.used >= coupon.maxUses) {
      return res.status(400).json({ message: "Coupon Ä‘Ã£ háº¿t lÆ°á»£t dÃ¹ng" });
    }
    res.json({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      expiresAt: coupon.expiresAt,
      remaining: coupon.maxUses ? coupon.maxUses - coupon.used : null,
    });
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng xÃ¡c thá»±c Ä‘Æ°á»£c coupon", error: err.message });
  }
};

