import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    notes: { type: String, default: "" },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["viewer", "editor"], default: "viewer" },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

projectSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Project", projectSchema);

