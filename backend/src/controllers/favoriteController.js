import mongoose from "mongoose";
import Favorite from "../models/Favorite.js";
import Product from "../models/Product.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.userId })
      .populate("product", "name price images slug")
      .sort({ createdAt: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được danh sách yêu thích", error: err.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { productId } = req.body || {};
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: "productId không hợp lệ" });
    }
    const product = await Product.findById(productId).select("_id");
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    const fav = await Favorite.findOneAndUpdate(
      { user: req.userId, product: productId },
      { user: req.userId, product: productId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await fav.populate("product", "name price images slug");
    res.status(201).json(fav);
  } catch (err) {
    res.status(500).json({ message: "Không thêm được yêu thích", error: err.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: "productId không hợp lệ" });
    }
    await Favorite.findOneAndDelete({ user: req.userId, product: productId });
    res.json({ message: "Đã xóa khỏi yêu thích" });
  } catch (err) {
    res.status(500).json({ message: "Không xóa được yêu thích", error: err.message });
  }
};
