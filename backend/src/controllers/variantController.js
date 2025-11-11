import mongoose from "mongoose";
import Variant from "../models/Variant.js";
import Product from "../models/Product.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listVariants = async (req, res) => {
  try {
    const { product } = req.query;
    const query = {};
    if (product) {
      if (!isValidObjectId(product)) return res.status(400).json({ message: "productId khÃ´ng há»£p lá»‡" });
      query.product = product;
    }
    const variants = await Variant.find(query).populate("product", "name");
    res.json(variants);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng láº¥y Ä‘Æ°á»£c biáº¿n thá»ƒ", error: err.message });
  }
};

export const createVariant = async (req, res) => {
  try {
    const { product, label, priceDelta = 0, sku, stock = 0 } = req.body || {};
    if (!product || !isValidObjectId(product)) {
      return res.status(400).json({ message: "productId khÃ´ng há»£p lá»‡" });
    }
    if (!label) return res.status(400).json({ message: "Thiáº¿u label" });
    const productExists = await Product.exists({ _id: product });
    if (!productExists) return res.status(400).json({ message: "Sáº£n pháº©m khÃ´ng tá»“n táº¡i" });
    const variant = await Variant.create({
      product,
      label: String(label).trim(),
      priceDelta: Number(priceDelta) || 0,
      sku,
      stock: Number(stock) || 0,
    });
    res.status(201).json(variant);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng táº¡o Ä‘Æ°á»£c biáº¿n thá»ƒ", error: err.message });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "ID khÃ´ng há»£p lá»‡" });
    const update = { ...req.body };
    if (update.product && !isValidObjectId(update.product)) {
      return res.status(400).json({ message: "productId khÃ´ng há»£p lá»‡" });
    }
    if (update.product) {
      const exists = await Product.exists({ _id: update.product });
      if (!exists) return res.status(400).json({ message: "Sáº£n pháº©m khÃ´ng tá»“n táº¡i" });
    }
    const variant = await Variant.findByIdAndUpdate(id, update, { new: true });
    if (!variant) return res.status(404).json({ message: "KhÃ´ng tÃ¬m tháº¥y biáº¿n thá»ƒ" });
    res.json(variant);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng cáº­p nháº­t Ä‘Æ°á»£c biáº¿n thá»ƒ", error: err.message });
  }
};

export const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: "ID khÃ´ng há»£p lá»‡" });
    const removed = await Variant.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "KhÃ´ng tÃ¬m tháº¥y biáº¿n thá»ƒ" });
    res.json({ message: "ÄÃ£ xÃ³a biáº¿n thá»ƒ" });
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng xÃ³a Ä‘Æ°á»£c biáº¿n thá»ƒ", error: err.message });
  }
};

