import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "staff", "customer"],
      default: "customer",
      index: true,
    },

    phone: { type: String, default: null, trim: true },
    gender: { type: String, enum: ["Nam", "Nữ", "Khác"], default: "Khác" },
    dateOfBirth: { type: Date, default: null },
    avatar: { type: String, default: "" },

    tokenVersion: { type: Number, default: 0 },
    resetPasswordToken: { type: String, default: null, index: true },
    resetPasswordExpires: { type: Date, default: null },
    emailMarketing: { type: Boolean, default: true },
    smsMarketing: { type: Boolean, default: false },
    shareDataWithPartners: { type: Boolean, default: false },
    deleteRequestedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
