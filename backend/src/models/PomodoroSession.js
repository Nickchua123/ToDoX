import mongoose from "mongoose";

const pomodoroSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", default: null, index: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null, index: true },
    phase: { type: String, enum: ["focus", "short", "long"], required: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, required: true },
    durationMs: { type: Number, required: true },
    aborted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

pomodoroSessionSchema.index({ user: 1, startedAt: 1 });

export default mongoose.model("PomodoroSession", pomodoroSessionSchema);

