import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

const normalizeSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listProducts = async (req, res) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      isPublished,
      page = 1,
      limit = 20,
      sort = "-createdAt",
    } = req.query;

    const query = {};
    if (q) {
      const rx = new RegExp(String(q).trim(), "i");
      query.$or = [{ name: rx }, { description: rx }, { slug: rx }];
    }
    if (category && isValidObjectId(category)) {
      query.category = category;
    }
    if (typeof isPublished !== "undefined") {
      query.isPublished = String(isPublished).toLowerCase() !== "false";
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const perPage = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * perPage;

    const [items, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name")
        .sort(sort)
        .skip(skip)
        .limit(perPage),
      Product.countDocuments(query),
    ]);

    res.json({ total, page: Number(page) || 1, items });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Không lấy được danh sách sản phẩm",
        error: err.message,
      });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const findBy = isValidObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };
    const product = await Product.findOne(findBy).populate("category", "name");
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    return res.json(product);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Không lấy được sản phẩm", error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      detail,
      category,
      price,
      oldPrice,
      stock,
      colors,
      sizes,
      images,
      isPublished = true,
    } = req.body || {};
    if (!name || !slug || !price || !category) {
      return res
        .status(400)
        .json({ message: "Thiếu name, slug, price hoặc category" });
    }
    if (!isValidObjectId(category)) {
      return res.status(400).json({ message: "Category không hợp lệ" });
    }
    const existsCategory = await Category.exists({ _id: category });
    if (!existsCategory) {
      return res.status(400).json({ message: "Category không tồn tại" });
    }

    const productSlug = normalizeSlug(slug);
    if (!productSlug)
      return res.status(400).json({ message: "Slug không hợp lệ" });
    const existing = await Product.findOne({ slug: productSlug });
    if (existing) return res.status(409).json({ message: "Slug đã tồn tại" });

    const doc = await Product.create({
      name: String(name).trim(),
      slug: productSlug,
      description: description || "",
      detail: detail || "",
      category,
      price,
      oldPrice: Number.isFinite(oldPrice) ? oldPrice : undefined,
      stock: Number.isFinite(stock) ? stock : 0,
      colors: Array.isArray(colors) ? colors : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      images: Array.isArray(images) ? images : [],
      isPublished: Boolean(isPublished),
    });

    res.status(201).json(doc);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không tạo được sản phẩm", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "ID không hợp lệ" });

    const update = { ...req.body };
    if (update.slug) {
      update.slug = normalizeSlug(update.slug);
    }
    if (update.category && !isValidObjectId(update.category)) {
      return res.status(400).json({ message: "Category không hợp lệ" });
    }
    if (update.category) {
      const existsCategory = await Category.exists({ _id: update.category });
      if (!existsCategory)
        return res.status(400).json({ message: "Category không tồn tại" });
    }

    if (update.colors && !Array.isArray(update.colors)) {
      update.colors = [];
    }
    if (update.sizes && !Array.isArray(update.sizes)) {
      update.sizes = [];
    }
    if (update.images && !Array.isArray(update.images)) {
      update.images = [];
    }

    const product = await Product.findByIdAndUpdate(id, update, { new: true });
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không cập nhật được sản phẩm", error: err.message });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const hard = String(req.query.hard || "").toLowerCase() === "true";
    if (!isValidObjectId(id))
      return res.status(400).json({ message: "ID không hợp lệ" });

    if (hard) {
      const removed = await Product.findByIdAndDelete(id);
      if (!removed)
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      return res.json({ message: "Đã xóa sản phẩm" });
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { isPublished: false },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    return res.json({ message: "Đã ẩn sản phẩm", product: updated });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Không xóa được sản phẩm", error: err.message });
  }
};
