import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    image: { type: String },
    publishedAt: { type: Date, default: Date.now },
    author: { type: String, default: "ND Shop" },
  },
  { timestamps: true }
);

export default mongoose.model("News", newsSchema);
