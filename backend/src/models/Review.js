import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String },
    body: { type: String, default: "" },
    approved: { type: Boolean, default: false },
    approvedAt: { type: Date },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
