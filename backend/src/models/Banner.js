import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String },
    priority: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
