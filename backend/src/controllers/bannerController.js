import Banner from "../models/Banner.js";

export const listPublicBanners = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const banners = await Banner.find({ active: true })
      .sort({ priority: -1, updatedAt: -1 })
      .limit(Math.min(Number(limit) || 10, 50));
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được banner", error: err.message });
  }
};

export const listAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ priority: -1, updatedAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được banner", error: err.message });
  }
};

export const createBanner = async (req, res) => {
  try {
    const { title, image, link, priority = 0, active = true } = req.body || {};
    if (!title || !image) {
      return res.status(400).json({ message: "Thiếu title hoặc image" });
    }
    const banner = await Banner.create({ title, image, link, priority, active });
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ message: "Không tạo được banner", error: err.message });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ message: "Không tìm thấy banner" });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: "Không cập nhật được banner", error: err.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const removed = await Banner.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: "Không tìm thấy banner" });
    res.json({ message: "Đã xóa banner" });
  } catch (err) {
    res.status(500).json({ message: "Không xóa được banner", error: err.message });
  }
};
