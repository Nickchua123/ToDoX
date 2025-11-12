import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" },
    name: { type: String, required: true },       // Tên sản phẩm tại thời điểm mua
    price: { type: Number, required: true },      // Giá chốt tại thời điểm đặt
    quantity: { type: Number, required: true },
    image: { type: String },                      // Ảnh thumbnail
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [orderItemSchema],

    total: { type: Number, required: true },
    subtotal: { type: Number, default: 0 },        // Tổng chưa tính phí ship
    shippingFee: { type: Number, default: 0 },     // Phí vận chuyển
    discount: { type: Number, default: 0 },        // Mã giảm giá nếu có

    status: {
      type: String,
      enum: [
        "pending",       // vừa đặt, chờ xác nhận
        "processing",    // đang xử lý / chuẩn bị hàng
        "shipped",       // đã giao cho đơn vị vận chuyển
        "delivered",     // giao thành công
        "cancelled",     // bị hủy
        "refunded"       // hoàn tiền
      ],
      default: "pending",
    },

    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },

    notes: { type: String, trim: true },
    cancelReason: { type: String, trim: true },

    trackingNumber: { type: String },              // Mã vận đơn
    estimatedDelivery: { type: Date },             // Ngày dự kiến giao

    cancellationRequested: { type: Boolean, default: false },
    cancellationRequestedAt: { type: Date },
    cancellationRequestReason: { type: String, trim: true },

    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
