import mongoose from "mongoose";
import PomodoroSession from "../models/PomodoroSession.js";

export const logSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { taskId = null, projectId = null, phase, startedAt, endedAt, durationMs, aborted = false } = req.body || {};
    if (!phase || !startedAt || !endedAt || !durationMs) {
      return res.status(400).json({ message: "Thiếu trường bắt buộc" });
    }

    const session = await PomodoroSession.create({
      user: userId,
      task: taskId || null,
      project: projectId || null,
      phase,
      startedAt: new Date(startedAt),
      endedAt: new Date(endedAt),
      durationMs,
      aborted: Boolean(aborted),
    });
    return res.json({ id: session._id });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Lỗi server" });
  }
};

function rangeToDates(range) {
  const now = new Date();
  let start;
  if (range === "today") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (range === "week") {
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1; // Monday start
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
    start.setHours(0, 0, 0, 0);
  } else if (range === "month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    start = new Date(0);
  }
  const end = now;
  return { start, end };
}

export const getStats = async (req, res) => {
  try {
    const userId = req.userId;
    const { range = "today", projectId } = req.query;
    const { start, end } = rangeToDates(range);

    const match = { user: new mongoose.Types.ObjectId(userId), phase: "focus", startedAt: { $gte: start, $lte: end } };
    if (projectId) match.project = new mongoose.Types.ObjectId(projectId);

    const agg = await PomodoroSession.aggregate([
      { $match: match },
      { $group: { _id: null, totalMs: { $sum: "$durationMs" }, count: { $sum: 1 } } },
    ]);

    const { totalMs = 0, count = 0 } = agg[0] || {};
    return res.json({ totalFocusMs: totalMs, focusCount: count });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Lỗi server" });
  }
};

export const getTaskCounts = async (req, res) => {
  try {
    const userId = req.userId;
    const { taskIds = "", range = "all" } = req.query;
    const ids = taskIds.split(",").map((s) => s.trim()).filter(Boolean);
    if (!ids.length) return res.json({});
    const { start, end } = rangeToDates(range);
    const match = { user: new mongoose.Types.ObjectId(userId), phase: "focus", task: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) } };
    if (range !== "all") match.startedAt = { $gte: start, $lte: end };

    const agg = await PomodoroSession.aggregate([
      { $match: match },
      { $group: { _id: "$task", count: { $sum: 1 } } },
    ]);
    const map = {};
    for (const row of agg) { map[row._id.toString()] = row.count; }
    return res.json(map);
  } catch (e) {
    return res.status(500).json({ message: e.message || "Lỗi server" });
  }
};

