import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { isAdminUser } from "../middleware/admin.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listReviews = async (req, res) => {
  try {
    const { product, page = 1, limit = 10 } = req.query;
    const query = {};
    if (product) {
      if (!isValidObjectId(product)) return res.status(400).json({ message: "productId không hợp lệ" });
      query.product = product;
    }
    const perPage = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * perPage;
    const [items, total] = await Promise.all([
      Review.find(query)
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),
      Review.countDocuments(query),
    ]);
    res.json({ total, page: Number(page) || 1, items });
  } catch (err) {
    res.status(500).json({ message: "Không lấy được đánh giá", error: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { product, rating, title, body } = req.body || {};
    if (!isValidObjectId(product)) return res.status(400).json({ message: "productId không hợp lệ" });
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Điểm rating 1-5" });
    }
    const exists = await Product.exists({ _id: product });
    if (!exists) return res.status(400).json({ message: "Sản phẩm không tồn tại" });
    const review = await Review.create({
      product,
      user: req.userId,
      rating,
      title,
      body,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Không tạo được đánh giá", error: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findOne({ _id: id, user: req.userId });
    if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    const { rating, title, body } = req.body || {};
    if (rating) {
      if (rating < 1 || rating > 5) return res.status(400).json({ message: "Điểm rating 1-5" });
      review.rating = rating;
    }
    if (typeof title !== "undefined") review.title = title;
    if (typeof body !== "undefined") review.body = body;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Không cập nhật được đánh giá", error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: id };
    const isAdmin = await isAdminUser(req.userId);
    if (!isAdmin) {
      query.user = req.userId;
    }
    const removed = await Review.findOneAndDelete(query);
    if (!removed) return res.status(404).json({ message: "Không tìm thấy đánh giá" });
    res.json({ message: "Đã xóa đánh giá" });
  } catch (err) {
    res.status(500).json({ message: "Không xóa được đánh giá", error: err.message });
  }
};
