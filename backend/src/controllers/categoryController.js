import mongoose from "mongoose";
import Category from "../models/Category.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const listCategories = async (req, res) => {
  try {
    const { q, parent, page, limit } = req.query;
    const query = {};
    if (q) {
      const rx = new RegExp(String(q).trim(), "i");
      query.$or = [{ name: rx }, { slug: rx }];
    }
    if (typeof parent !== "undefined") {
      if (parent === "null") query.parent = null;
      else if (parent === "notnull") query.parent = { $ne: null };
      else query.parent = parent;
    }

    const usePagination = typeof page !== "undefined";
    if (!usePagination) {
      const categories = await Category.find(query).sort({ createdAt: -1 });
      return res.json(categories);
    }

    const perPage = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (pageNumber - 1) * perPage;

    const [items, total] = await Promise.all([
      Category.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),
      Category.countDocuments(query),
    ]);
    res.json({ total, page: pageNumber, items });
  } catch (err) {
    res.status(500).json({ message: "Không lấy được danh mục", error: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const cond = isValidObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
    const category = await Category.findOne(cond);
    if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được danh mục", error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, parent } = req.body || {};
    if (!name) return res.status(400).json({ message: "Thiếu tên danh mục" });
    const finalSlug = slugify(slug || name);
    if (!finalSlug) return res.status(400).json({ message: "Slug không hợp lệ" });

    if (parent && !isValidObjectId(parent)) {
      return res.status(400).json({ message: "Parent không hợp lệ" });
    }

    const exists = await Category.findOne({ slug: finalSlug });
    if (exists) return res.status(409).json({ message: "Slug đã tồn tại" });
    const doc = await Category.create({
      name: String(name).trim(),
      slug: finalSlug,
      description: description || "",
      image,
      parent: parent || null,
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Không tạo được danh mục", error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "ID không hợp lệ" });
    const update = { ...req.body };
    if (update.name && !update.slug) {
      update.slug = slugify(update.name);
    }
    if (update.slug) update.slug = slugify(update.slug);
    if (update.parent && !isValidObjectId(update.parent)) {
      return res.status(400).json({ message: "Parent không hợp lệ" });
    }
    if (update.parent === "null") update.parent = null;

    const category = await Category.findByIdAndUpdate(id, update, { new: true });
    if (!category) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Không cập nhật được danh mục", error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "ID không hợp lệ" });
    const child = await Category.findOne({ parent: id });
    if (child) return res.status(400).json({ message: "Còn danh mục con, không thể xóa" });
    const removed = await Category.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json({ message: "Đã xóa danh mục" });
  } catch (err) {
    res.status(500).json({ message: "Không xóa được danh mục", error: err.message });
  }
};

