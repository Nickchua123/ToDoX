import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    method: { type: String, required: true },
    provider: { type: String },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    reference: { type: String },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
