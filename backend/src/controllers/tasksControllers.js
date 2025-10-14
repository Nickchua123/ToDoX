// backend/src/controllers/tasksControllers.js
import mongoose from "mongoose";
import Task from "../models/Task.js";
import Project from "../models/Project.js";

const ALLOWED_FILTERS = ["today", "week", "month", "all"];
const ALLOWED_STATUS = ["active", "complete"];

export const getAllTasks = async (req, res) => {
  const { filter = "today", projectId } = req.query;
  const safeFilter = ALLOWED_FILTERS.includes(filter) ? filter : "today";

  const now = new Date();
  let startDate;
  switch (safeFilter) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week": {
      const mondayDate = now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "all":
    default:
      startDate = null;
  }

  const userId = new mongoose.Types.ObjectId(req.userId);
  const query = startDate ? { user: userId, createdAt: { $gte: startDate } } : { user: userId };
  if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
    query.project = new mongoose.Types.ObjectId(projectId);
  }

  try {
    const result = await Task.aggregate([
      { $match: query },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completeCount: [{ $match: { status: "complete" } }, { $count: "count" }],
        },
      },
    ]);

    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;

    res.status(200).json({ tasks, activeCount, completeCount });
  } catch (error) {
    console.error("Lỗi khi gọi getAllTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createTask = async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const { projectId } = req.body || {};
    if (!title) {
      return res.status(400).json({ message: "Title không được để trống" });
    }

    const doc = { title, user: req.userId };
    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: "Project ID không hợp lệ" });
      }
      const owned = await Project.exists({ _id: projectId, user: req.userId });
      if (!owned) return res.status(404).json({ message: "Không tìm thấy dự án" });
      doc.project = projectId;
    }

    const task = new Task(doc);
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi khi gọi createTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, status, completedAt, projectId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    if (status && !ALLOWED_STATUS.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const update = {};
    if (typeof title !== "undefined") update.title = String(title).trim();
    if (typeof status !== "undefined") update.status = status;
    if (typeof completedAt !== "undefined") update.completedAt = completedAt;
    if (typeof projectId !== "undefined") {
      if (!projectId) {
        update.project = null;
      } else if (mongoose.Types.ObjectId.isValid(projectId)) {
        const owned = await Project.exists({ _id: projectId, user: req.userId });
        if (!owned) return res.status(404).json({ message: "Không tìm thấy dự án" });
        update.project = projectId;
      } else {
        return res.status(400).json({ message: "Project ID không hợp lệ" });
      }
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      update,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Lỗi khi gọi updateTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const deleted = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }

    res.status(200).json(deleted);
  } catch (error) {
    console.error("Lỗi khi gọi deleteTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

