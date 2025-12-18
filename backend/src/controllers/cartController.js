import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Variant from "../models/Variant.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeOptions = (options = {}) => {
  const color = options.color ? String(options.color).trim() : undefined;
  const size = options.size ? String(options.size).trim() : undefined;
  return {
    ...(color ? { color } : {}),
    ...(size ? { size } : {}),
  };
};

const sameOptions = (a = {}, b = {}) => {
  return (
    (a.color || "") === (b.color || "") && (a.size || "") === (b.size || "")
  );
};

const getOrCreateCart = async (userId) => {
  const existing = await Cart.findOne({ user: userId });
  if (existing) return existing;
  return Cart.create({ user: userId, items: [] });
};

const loadProduct = async (productId) => {
  if (!isValidObjectId(productId)) throw new Error("productId không hợp lệ");
  const product = await Product.findById(productId);
  if (!product) throw new Error("Sản phẩm không tồn tại");
  return product;
};

export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.userId);
    await cart.populate("items.product", "name price images");
    await cart.populate("items.variant", "label priceDelta");
    res.json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không lấy được giỏ hàng", error: err.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { productId, variantId, quantity = 1, options = {} } = req.body || {};
    const product = await loadProduct(productId);
    if (variantId && !isValidObjectId(variantId)) {
      return res.status(400).json({ message: "variantId không hợp lệ" });
    }
    if (variantId) {
      const variant = await Variant.findOne({
        _id: variantId,
        product: product._id,
      });
      if (!variant)
        return res.status(400).json({ message: "Biến thể không tồn tại" });
    }
    if (quantity <= 0)
      return res.status(400).json({ message: "Số lượng phải > 0" });

    const cart = await getOrCreateCart(req.userId);
    const normalizedOptions = normalizeOptions(options);
    const idx = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        ((variantId && item.variant?.toString() === variantId) ||
          (!variantId && !item.variant)) &&
        sameOptions(item.options, normalizedOptions)
    );
    if (idx >= 0) {
      cart.items[idx].quantity += Number(quantity);
      cart.items[idx].options = normalizedOptions;
    } else {
      cart.items.push({
        product: productId,
        variant: variantId || undefined,
        quantity: Number(quantity),
        options: normalizedOptions,
      });
    }
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate("items.product", "name price images");
    await cart.populate("items.variant", "label priceDelta");
    res.json(cart);
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message || "Không thêm được sản phẩm" });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body || {};
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Số lượng phải > 0" });
    }
    const cart = await getOrCreateCart(req.userId);
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Không tìm thấy item" });
    item.quantity = Number(quantity);
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate("items.product", "name price images");
    await cart.populate("items.variant", "label priceDelta");
    res.json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không cập nhật được item", error: err.message });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await getOrCreateCart(req.userId);
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Không tìm thấy item" });
    item.deleteOne();
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate("items.product", "name price images");
    await cart.populate("items.variant", "label priceDelta");
    res.json({ message: "Item removed", remaining: cart.items });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không xóa được item", error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.userId);
    cart.items = [];
    cart.updatedAt = new Date();
    await cart.save();
    res.json({ message: "Cart cleared", items: [] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không làm rỗng giỏ hàng", error: err.message });
  }
};
