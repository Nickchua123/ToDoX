import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Variant from "../models/Variant.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getOrCreateCart = async (userId) => {
  const existing = await Cart.findOne({ user: userId });
  if (existing) return existing;
  return Cart.create({ user: userId, items: [] });
};

const loadProduct = async (productId) => {
  if (!isValidObjectId(productId)) throw new Error("productId khÃ´ng há»£p lá»‡");
  const product = await Product.findById(productId);
  if (!product) throw new Error("Sáº£n pháº©m khÃ´ng tá»“n táº¡i");
  return product;
};

export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.userId);
    await cart.populate("items.product", "name price images");
    await cart.populate("items.variant", "label priceDelta");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng láº¥y Ä‘Æ°á»£c giá» hÃ ng", error: err.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body || {};
    const product = await loadProduct(productId);
    if (variantId && !isValidObjectId(variantId)) {
      return res.status(400).json({ message: "variantId khÃ´ng há»£p lá»‡" });
    }
    if (variantId) {
      const variant = await Variant.findOne({ _id: variantId, product: product._id });
      if (!variant) return res.status(400).json({ message: "Biáº¿n thá»ƒ khÃ´ng tá»“n táº¡i" });
    }
    if (quantity <= 0) return res.status(400).json({ message: "Sá»‘ lÆ°á»£ng pháº£i > 0" });

    const cart = await getOrCreateCart(req.userId);
    const idx = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        ((variantId && item.variant?.toString() === variantId) || (!variantId && !item.variant))
    );
    if (idx >= 0) {
      cart.items[idx].quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, variant: variantId || undefined, quantity: Number(quantity) });
    }
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate("items.product", "name price images");
    await cart.populate("items.variant", "label priceDelta");
    res.json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message || "KhÃ´ng thÃªm Ä‘Æ°á»£c sáº£n pháº©m" });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body || {};
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Sá»‘ lÆ°á»£ng pháº£i > 0" });
    }
    const cart = await getOrCreateCart(req.userId);
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "KhÃ´ng tÃ¬m tháº¥y item" });
    item.quantity = Number(quantity);
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate("items.product", "name price images");
    await cart.populate("items.variant", "label priceDelta");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng cáº­p nháº­t Ä‘Æ°á»£c item", error: err.message });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await getOrCreateCart(req.userId);
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "KhÃ´ng tÃ¬m tháº¥y item" });
    item.deleteOne();
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate("items.product", "name price images");
    await cart.populate("items.variant", "label priceDelta");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng xÃ³a Ä‘Æ°á»£c item", error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.userId);
    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "KhÃ´ng lÃ m rá»—ng giá» hÃ ng", error: err.message });
  }
};

