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
    const { q, parent } = req.query;
    const query = {};
    if (q) {
      const rx = new RegExp(String(q).trim(), "i");
      query.$or = [{ name: rx }, { slug: rx }];
    }
    if (parent) {
      query.parent = parent === "null" ? null : parent;
    }
    const categories = await Category.find(query).sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng láº¥y Ä‘Æ°á»£c danh má»¥c", error: err.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const cond = isValidObjectId(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };
    const category = await Category.findOne(cond);
    if (!category) return res.status(404).json({ message: "KhÃ´ng tÃ¬m tháº¥y danh má»¥c" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng láº¥y Ä‘Æ°á»£c danh má»¥c", error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, parent } = req.body || {};
    if (!name) return res.status(400).json({ message: "Thiáº¿u tÃªn danh má»¥c" });
    const finalSlug = slugify(slug || name);
    if (!finalSlug) return res.status(400).json({ message: "Slug khÃ´ng há»£p lá»‡" });

    if (parent && !isValidObjectId(parent)) {
      return res.status(400).json({ message: "Parent khÃ´ng há»£p lá»‡" });
    }

    const exists = await Category.findOne({ slug: finalSlug });
    if (exists) return res.status(409).json({ message: "Slug Ä‘Ã£ tá»“n táº¡i" });

    const doc = await Category.create({
      name: String(name).trim(),
      slug: finalSlug,
      description: description || "",
      image,
      parent: parent || null,
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng táº¡o Ä‘Æ°á»£c danh má»¥c", error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "ID khÃ´ng há»£p lá»‡" });
    const update = { ...req.body };
    if (update.name && !update.slug) {
      update.slug = slugify(update.name);
    }
    if (update.slug) update.slug = slugify(update.slug);
    if (update.parent && !isValidObjectId(update.parent)) {
      return res.status(400).json({ message: "Parent khÃ´ng há»£p lá»‡" });
    }
    if (update.parent === "null") update.parent = null;

    const category = await Category.findByIdAndUpdate(id, update, { new: true });
    if (!category) return res.status(404).json({ message: "KhÃ´ng tÃ¬m tháº¥y danh má»¥c" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng cáº­p nháº­t Ä‘Æ°á»£c danh má»¥c", error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "ID khÃ´ng há»£p lá»‡" });
    const child = await Category.findOne({ parent: id });
    if (child) return res.status(400).json({ message: "CÃ²n danh má»¥c con, khÃ´ng thá»ƒ xoÃ¡" });
    const removed = await Category.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "KhÃ´ng tÃ¬m tháº¥y danh má»¥c" });
    res.json({ message: "ÄÃ£ xÃ³a danh má»¥c" });
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng xÃ³a Ä‘Æ°á»£c danh má»¥c", error: err.message });
  }
};

