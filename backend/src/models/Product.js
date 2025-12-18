import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" }, // mô tả ngắn
    detail: { type: String, default: "" }, // mô tả dài (thông tin sản phẩm)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    oldPrice: { type: Number }, // giá gốc
    stock: { type: Number, default: 0 },
    colors: [{ type: String }], // ví dụ ["Hồng be", "Xám", "Đen"]
    sizes: [{ type: String }], // ví dụ ["S", "M", "L", "XL"]
    images: [{ type: String }], // các link ảnh Cloudinary
    rating: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
