import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

projectSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model("Project", projectSchema);

