import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String, default: "Nhà" },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    provinceId: { type: Number },
    districtId: { type: Number },
    wardCode: { type: String },
    provinceName: { type: String },
    districtName: { type: String },
    wardName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);
