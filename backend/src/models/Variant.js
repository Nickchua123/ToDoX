import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    label: { type: String, required: true },
    priceDelta: { type: Number, default: 0 },
    sku: { type: String },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Variant", variantSchema);
