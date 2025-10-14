// backend/src/controllers/tasksControllers.js
import mongoose from "mongoose";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { publish } from "../utils/sse.js";

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
  let query;
  // If querying a specific project, allow access when user is owner or shared member
  if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
    const pid = new mongoose.Types.ObjectId(projectId);
    try {
      const accessible = await Project.exists({
        _id: pid,
        $or: [{ user: userId }, { "members.user": userId }],
      });
      if (!accessible) return res.status(404).json({ message: "Không tìm thấy dự án" });
    } catch (e) {
      return res.status(500).json({ message: "Lỗi hệ thống" });
    }
    query = startDate ? { project: pid, createdAt: { $gte: startDate } } : { project: pid };
  } else {
    // Personal view (no project filter): only own tasks
    query = startDate ? { user: userId, createdAt: { $gte: startDate } } : { user: userId };
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
    console.error("Loi khi goi getAllTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createTask = async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    const { projectId } = req.body || {};
    if (!title) {
      return res.status(400).json({ message: "Title khong duoc de trong" });
    }

    const doc = { title, user: req.userId };
    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({ message: "Project ID không hợp lệ" });
      }
      const uid = new mongoose.Types.ObjectId(String(req.userId));
      const canWrite = await Project.exists({
        _id: projectId,
        $or: [
          { user: uid },
          { "members.user": uid, "members.role": "editor" },
        ],
      });
      if (!canWrite) return res.status(404).json({ message: "Không tìm thấy dự án" });
      doc.project = projectId;
    }

    const task = new Task(doc);
    const newTask = await task.save();
    try { publish("task_changed", { type: "created", taskId: newTask._id, projectId: newTask.project || null }); } catch {}
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Loi khi goi createTask", error);
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

    const existing = await Task.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }

    const uid = new mongoose.Types.ObjectId(String(req.userId));
    let canEdit = false;
    if (existing.project) {
      canEdit = await Project.exists({
        _id: existing.project,
        $or: [
          { user: uid },
          { "members.user": uid, "members.role": "editor" },
        ],
      });
    } else {
      canEdit = String(existing.user) === String(req.userId);
    }
    if (!canEdit) return res.status(403).json({ message: "Không có quyền sửa" });

    const update = {};
    if (typeof title !== "undefined") update.title = String(title).trim();
    if (typeof status !== "undefined") update.status = status;
    if (typeof completedAt !== "undefined") update.completedAt = completedAt;
    if (typeof projectId !== "undefined") {
      if (!projectId) {
        update.project = null;
      } else if (mongoose.Types.ObjectId.isValid(projectId)) {
        const canMove = await Project.exists({
          _id: projectId,
          $or: [
            { user: uid },
            { "members.user": uid, "members.role": "editor" },
          ],
        });
        if (!canMove) return res.status(404).json({ message: "Không tìm thấy dự án" });
        update.project = projectId;
      } else {
        return res.status(400).json({ message: "Project ID không hợp lệ" });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(existing._id, update, { new: true });
    try { publish("task_changed", { type: "updated", taskId: updatedTask._id, projectId: updatedTask.project || null }); } catch {}
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Loi khi goi updateTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    // Load task and check delete permission (owner/editor of project or owner of personal task)
    const existing = await Task.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }

    const uid = new mongoose.Types.ObjectId(String(req.userId));
    let canDelete = false;
    if (existing.project) {
      canDelete = await Project.exists({
        _id: existing.project,
        $or: [
          { user: uid },
          { "members.user": uid, "members.role": "editor" },
        ],
      });
    } else {
      canDelete = String(existing.user) === String(req.userId);
    }
    if (!canDelete) return res.status(403).json({ message: "Không có quyền xóa" });

    const deleted = await Task.findByIdAndDelete(existing._id);
    try { publish("task_changed", { type: "deleted", taskId: deleted._id, projectId: deleted.project || null }); } catch {}
    res.status(200).json(deleted);
  } catch (error) {
    console.error("Loi khi goi deleteTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

