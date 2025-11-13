import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import { isAdminUser } from "../middleware/admin.js";
import { createNotification, NotificationType } from "../utils/notification.js";
import { ghnCancelOrder, ghnCreateOrder } from "../services/ghnService.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const STATUS_LABELS = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
  refunded: "Hoàn tiền",
};

const GHN_ENABLED = Boolean(process.env.GHN_TOKEN && process.env.GHN_SHOP_ID);

const normalizeOptions = (options = {}) => {
  const color = options.color ? String(options.color).trim() : undefined;
  const size = options.size ? String(options.size).trim() : undefined;
  return {
    ...(color ? { color } : {}),
    ...(size ? { size } : {}),
  };
};

const getAddressSnapshot = (address) => {
  if (!address) return {};
  return {
    city: address.city,
    district: address.district,
    ward: address.ward,
    line1: address.line1,
    line2: address.line2,
    phone: address.phone,
    provinceId: address.provinceId,
    districtId: address.districtId,
    wardCode: address.wardCode,
    provinceName: address.provinceName,
    districtName: address.districtName,
    wardName: address.wardName,
  };
};

const defaultPickupInfo = () => ({
  from_name: process.env.GHN_FROM_NAME || "ND Style",
  from_phone: process.env.GHN_FROM_PHONE || "0000000000",
  from_address: process.env.GHN_FROM_ADDRESS || "ND Style Store",
  from_ward_name: process.env.GHN_FROM_WARD_NAME || "",
  from_district_name: process.env.GHN_FROM_DISTRICT_NAME || "",
  from_province_name: process.env.GHN_FROM_PROVINCE_NAME || "",
});

const buildOrderItemsForShipment = (orderItems = [], fallbackWeight = 500) =>
  orderItems.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    weight: fallbackWeight,
    price: item.price,
  }));

const createGHNShipment = async ({
  order,
  address,
  shippingSelection = {},
  shippingPackage = {},
  orderItems,
}) => {
  if (!GHN_ENABLED) {
    throw new Error("GHN chưa được cấu hình");
  }
  if (!address) {
    throw new Error("Không tìm thấy địa chỉ giao hàng");
  }
  const toDistrictId =
    shippingSelection.toDistrictId ||
    shippingSelection.to_district_id ||
    address.districtId;
  const toWardCode =
    shippingSelection.toWardCode ||
    shippingSelection.to_ward_code ||
    address.wardCode;
  if (!toDistrictId || !toWardCode) {
    throw new Error("Địa chỉ chưa có mã quận/huyện hoặc phường/xã GHN");
  }
  const serviceTypeId =
    shippingSelection.serviceTypeId || shippingSelection.service_type_id;
  if (!serviceTypeId) {
    throw new Error("Thiếu service_type_id");
  }
  const serviceId = shippingSelection.serviceId || shippingSelection.service_id;
  const packageWeight =
    Number(shippingPackage.weight ?? shippingSelection.weight) ||
    Number(shippingSelection.total_weight) ||
    orderItems.reduce((sum, item) => sum + Number(item.quantity || 0) * 500, 0) ||
    500;
  const payload = {
    ...defaultPickupInfo(),
    to_name:
      shippingSelection.receiverName ||
      order.shippingMeta?.receiverName ||
      "Khách hàng",
    to_phone: shippingSelection.receiverPhone || address.phone,
    to_address: `${address.line1}${address.line2 ? `, ${address.line2}` : ""}`,
    to_ward_name: address.wardName || address.ward,
    to_district_name: address.districtName || address.district,
    to_province_name: address.provinceName || address.city,
    to_district_id: Number(toDistrictId),
    to_ward_code: toWardCode,
    service_type_id: Number(serviceTypeId),
    service_id: serviceId ? Number(serviceId) : undefined,
    client_order_code:
      shippingSelection.clientOrderCode ||
      shippingSelection.client_order_code ||
      order._id.toString(),
    cod_amount:
      shippingSelection.codAmount ??
      shippingSelection.cod_amount ??
      (order.paymentMethod === "cod" ? order.total : 0),
    weight: packageWeight,
    length: Number(shippingPackage.length) || 30,
    width: Number(shippingPackage.width) || 20,
    height: Number(shippingPackage.height) || 10,
    insurance_value: Number(shippingSelection.insuranceValue) || order.total,
    items: buildOrderItemsForShipment(
      orderItems,
      Math.max(200, Math.round(packageWeight / Math.max(orderItems.length, 1)))
    ),
    note: order.notes || "",
    required_note: shippingSelection.required_note || "KHONGCHOXEMHANG",
  };
  return ghnCreateOrder(payload);
};

const enrichItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Danh sách sản phẩm trống");
  }
  const normalized = items.map((item) => ({
    productId: item.productId || item.product,
    quantity: Number(item.quantity) || 0,
    variant: item.variantId || item.variant,
    options: normalizeOptions(item.options || {}),
  }));
  const productIds = normalized.map((i) => i.productId).filter(isValidObjectId);
  if (productIds.length !== normalized.length) throw new Error("productId không hợp lệ");
  const products = await Product.find({
    _id: productIds,
    isPublished: true,
  });
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
      image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : undefined,
      options: item.options,
    };
  });

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { orderItems, total, products: productMap };
};

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      addressId,
      notes,
      shippingFee = 0,
      discount = 0,
      paymentMethod = "cod",
      shipping = {},
    } = req.body || {};
    if (!addressId) {
      return res.status(400).json({ message: "Thiếu địa chỉ nhận hàng" });
    }
    if (!isValidObjectId(addressId)) {
      return res.status(400).json({ message: "Địa chỉ không hợp lệ" });
    }
    const address = await Address.findOne({ _id: addressId, user: req.userId });
    if (!address) return res.status(400).json({ message: "Không tìm thấy địa chỉ" });

    const { orderItems } = await enrichItems(items);
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalShipping = Number(shippingFee) || 0;
    const finalDiscount = Number(discount) || 0;

    const shippingSelection = shipping.selection || {};
    const shippingPackage = shipping.package || {};
    const shippingProvider = shipping.provider || "manual";

    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      subtotal,
      shippingFee: finalShipping,
      discount: finalDiscount,
      total: subtotal + finalShipping - finalDiscount,
      address: addressId,
      notes,
      paymentMethod: paymentMethod || "cod",
      shippingProvider,
      shippingServiceName: shippingSelection.serviceName || shippingSelection.short_name,
      shippingServiceCode: shippingSelection.serviceCode,
      shippingServiceTypeId: shippingSelection.serviceTypeId || shippingSelection.service_type_id,
      shippingClientOrderCode: shippingSelection.clientOrderCode || shippingSelection.client_order_code,
      shippingStatus: shippingProvider === "ghn" ? "booking" : undefined,
      shippingMeta: {
        ...shippingSelection,
        package: shippingPackage,
        addressSnapshot: getAddressSnapshot(address),
      },
    });

    await Promise.all(
      orderItems.map((item) =>
        Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } })
      )
    );

    if (shippingProvider === "ghn") {
      try {
        const ghnResult = await createGHNShipment({
          order,
          address,
          shippingSelection,
          shippingPackage,
          orderItems,
        });
        order.shippingTrackingCode = ghnResult?.order_code;
        order.shippingStatus = ghnResult?.status || "created";
        order.shippingClientOrderCode =
          order.shippingClientOrderCode || ghnResult?.client_order_code;
        order.shippingMeta = {
          ...order.shippingMeta,
          ghn: ghnResult,
        };
        if (!order.estimatedDelivery && ghnResult?.expected_delivery_time) {
          order.estimatedDelivery = new Date(ghnResult.expected_delivery_time);
        }
        if (!finalShipping && ghnResult?.total_fee) {
          order.shippingFee = ghnResult.total_fee;
          order.total = order.subtotal + order.shippingFee - order.discount;
        }
        await order.save();
      } catch (err) {
        console.error("[GHN] Không tạo được vận đơn:", err.message);
        order.shippingStatus = "error";
        order.shippingMeta = {
          ...order.shippingMeta,
          ghnError: err.message,
        };
        await order.save();
      }
    }

    res.status(201).json(order);
    createNotification({
      user: req.userId,
      type: NotificationType.ORDER,
      title: "Đặt hàng thành công",
      message: `Đơn hàng #${order._id} đã được tạo và chờ xác nhận.`,
      data: { orderId: order._id, status: order.status },
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "Không tạo được đơn hàng" });
  }
};

export const listMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { user: req.userId };
    if (status) query.status = status;

    const perPage = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (pageNumber - 1) * perPage;

    const [items, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate("items.product", "name images price")
        .populate("address"),
      Order.countDocuments(query),
    ]);

    res.json({ total, page: pageNumber, items });
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
    createNotification({
      user: order.user,
      type: NotificationType.ORDER,
      title: "Đơn hàng được cập nhật",
      message: `Đơn hàng #${order._id} hiện ở trạng thái ${STATUS_LABELS[status] || status}.`,
      data: { orderId: order._id, status },
    });
  } catch (err) {
    res.status(500).json({ message: "Không cập nhật được đơn hàng", error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body || {};
    if (!isValidObjectId(orderId)) return res.status(400).json({ message: "ID không hợp lệ" });
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    const isOwner = order.user?.toString() === req.userId;
    if (!isOwner) return res.status(403).json({ message: "Không có quyền hủy" });
    if (!["pending", "processing"].includes(order.status)) {
      return res.status(400).json({ message: "Không thể hủy ở trạng thái hiện tại" });
    }

    order.status = "cancelled";
    if (reason) order.cancelReason = reason;
    order.cancellationRequested = false;
    order.cancellationRequestedAt = null;
    order.cancellationRequestReason = undefined;
    await order.save();
    if (order.shippingProvider === "ghn" && order.shippingTrackingCode) {
      try {
        await ghnCancelOrder([order.shippingTrackingCode]);
      } catch (cancelErr) {
        console.warn("[GHN] Không hủy được vận đơn:", cancelErr.message);
      }
    }
    await Promise.all(
      order.items.map((item) =>
        Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })
      )
    );
    res.json(order);
    createNotification({
      user: order.user,
      type: NotificationType.ORDER,
      title: "Đơn hàng đã được hủy",
      message: `Bạn đã hủy đơn hàng #${order._id}${reason ? ` (${reason})` : ""}.`,
      data: { orderId: order._id, status: order.status },
    });
  } catch (err) {
    res.status(500).json({ message: "Không hủy được đơn hàng", error: err.message });
  }
};

export const requestCancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body || {};
    if (!isValidObjectId(orderId)) return res.status(400).json({ message: "ID không hợp lệ" });
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    const isOwner = order.user?.toString() === req.userId;
    if (!isOwner) return res.status(403).json({ message: "Không có quyền yêu cầu hủy" });
    if (order.status !== "processing") {
      return res.status(400).json({ message: "Chỉ có thể gửi yêu cầu khi đơn đang xử lý" });
    }
    if (order.cancellationRequested) {
      return res.status(400).json({ message: "Bạn đã gửi yêu cầu hủy trước đó" });
    }
    order.cancellationRequested = true;
    order.cancellationRequestedAt = new Date();
    if (reason) order.cancellationRequestReason = reason;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Không gửi được yêu cầu hủy", error: err.message });
  }
};

export const confirmOrderDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!isValidObjectId(orderId)) return res.status(400).json({ message: "ID không hợp lệ" });
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    const isOwner = order.user?.toString() === req.userId;
    if (!isOwner) return res.status(403).json({ message: "Không có quyền xác nhận" });
    if (order.status !== "shipped") {
      return res.status(400).json({ message: "Chỉ xác nhận khi đơn đang giao" });
    }

    order.status = "delivered";
    order.isDelivered = true;
    order.deliveredAt = new Date();
    await order.save();
    res.json(order);
    createNotification({
      user: order.user,
      type: NotificationType.ORDER,
      title: "Đơn hàng đã giao",
      message: `Đơn hàng #${order._id} đã được xác nhận giao thành công.`,
      data: { orderId: order._id, status: order.status },
    });
  } catch (err) {
    res.status(500).json({ message: "Không xác nhận được đơn hàng", error: err.message });
  }
};
