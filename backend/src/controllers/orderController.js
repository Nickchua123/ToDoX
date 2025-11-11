import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import { isAdminUser } from "../middleware/admin.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const enrichItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Danh sách sản phẩm trống");
  }
  const normalized = items.map((item) => ({
    productId: item.productId || item.product,
    quantity: Number(item.quantity) || 0,
    variant: item.variantId || item.variant,
  }));
  const productIds = normalized.map((i) => i.productId).filter(isValidObjectId);
  if (productIds.length !== normalized.length) throw new Error("productId không hợp lệ");
  const products = await Product.find({ _id: { $in: productIds }, isPublished: { $ne: false } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const orderItems = normalized.map((item) => {
    const product = productMap.get(item.productId.toString());
    if (!product) throw new Error("Sản phẩm không tồn tại hoặc đã ngừng bán");
    if (item.quantity <= 0) throw new Error("Số lượng phải lớn hơn 0");
    if (product.stock < item.quantity) throw new Error(`Sản phẩm ${product.name} không đủ hàng`);
    return {
      product: product._id,
      variant: item.variant ? item.variant : undefined,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    };
  });

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { orderItems, total, products: productMap };
};

export const createOrder = async (req, res) => {
  try {
    const { items, addressId, notes } = req.body || {};
    const { orderItems, total, products } = await enrichItems(items);

    if (addressId && !isValidObjectId(addressId)) {
      return res.status(400).json({ message: "Địa chỉ không hợp lệ" });
    }
    if (addressId) {
      const addr = await Address.findOne({ _id: addressId, user: req.userId });
      if (!addr) return res.status(400).json({ message: "Không tìm thấy địa chỉ" });
    }

    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      total,
      address: addressId,
      notes,
    });

    await Promise.all(
      orderItems.map((item) =>
        Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } })
      )
    );

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message || "Không tạo được đơn hàng" });
  }
};

export const listMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate("items.product", "name images price")
      .populate("address");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được đơn hàng", error: err.message });
  }
};

export const listOrders = async (req, res) => {
  try {
    const { status, user, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (user && isValidObjectId(user)) query.user = user;

    const perPage = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * perPage;

    const [items, total] = await Promise.all([
      Order.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),
      Order.countDocuments(query),
    ]);

    res.json({ total, page: Number(page) || 1, items });
  } catch (err) {
    res.status(500).json({ message: "Không lấy được danh sách đơn hàng", error: err.message });
  }
};

export const getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!isValidObjectId(orderId)) return res.status(400).json({ message: "ID không hợp lệ" });
    const order = await Order.findById(orderId)
      .populate("items.product", "name images price")
      .populate("user", "name email")
      .populate("address");
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    const isOwner = order.user?._id?.toString() === req.userId;
    const admin = await isAdminUser(req.userId);
    if (!isOwner && !admin) {
      return res.status(403).json({ message: "Không có quyền xem đơn hàng" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được đơn hàng", error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body || {};
    const allowed = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    if (!isValidObjectId(orderId)) return res.status(400).json({ message: "ID không hợp lệ" });

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Không cập nhật được đơn hàng", error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!isValidObjectId(orderId)) return res.status(400).json({ message: "ID không hợp lệ" });
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    const isOwner = order.user?.toString() === req.userId;
    if (!isOwner) return res.status(403).json({ message: "Không có quyền hủy" });
    if (!["pending", "processing"].includes(order.status)) {
      return res.status(400).json({ message: "Không thể hủy ở trạng thái hiện tại" });
    }

    order.status = "cancelled";
    await order.save();
    await Promise.all(
      order.items.map((item) =>
        Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })
      )
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Không hủy được đơn hàng", error: err.message });
  }
};
