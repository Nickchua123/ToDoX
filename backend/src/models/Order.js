import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variant: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
