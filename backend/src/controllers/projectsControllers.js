import mongoose from "mongoose";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { publish } from "../utils/sse.js";

// Helper to validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// List projects (owner or shared member)
export const listProjects = async (req, res) => {
  try {
    const uid = new mongoose.Types.ObjectId(String(req.userId));
    const projects = await Project.find({
      $or: [
        { user: uid },
        { "members.user": uid },
      ],
    }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Create project (owner only)
export const createProject = async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    if (!name) return res.status(400).json({ message: "Tên dự án không được để trống" });
    const project = await Project.create({ user: req.userId, name });
    res.status(201).json(project);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Dự án đã tồn tại" });
    }
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Rename project (owner or editor member)
export const renameProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "ID không hợp lệ" });
    const name = String(req.body?.name || "").trim();
    if (!name) return res.status(400).json({ message: "Tên dự án không được để trống" });
    const uid = new mongoose.Types.ObjectId(String(req.userId));
    const updated = await Project.findOneAndUpdate(
      {
        _id: id,
        $or: [
          { user: uid },
          { members: { $elemMatch: { user: uid, role: "editor" } } },
        ],
      },
      { name },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Không tìm thấy dự án" });
    res.status(200).json(updated);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "Dự án đã tồn tại" });
    }
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Delete project (owner only)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "ID không hợp lệ" });
    const deleted = await Project.findOneAndDelete({ _id: id, user: req.userId });
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy dự án" });
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Get single project (owner or member)
export const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "ID không hợp lệ" });
    const uid = new mongoose.Types.ObjectId(String(req.userId));
    const project = await Project.findOne({
      _id: id,
      $or: [
        { user: uid },
        { "members.user": uid },
      ],
    });
    if (!project) return res.status(404).json({ message: "Không tìm thấy dự án" });
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Update description/notes (owner or editor member)
export const updateProjectMeta = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "ID không hợp lệ" });
    const { description = "", notes = "" } = req.body || {};
    const uid = new mongoose.Types.ObjectId(String(req.userId));
    const updated = await Project.findOneAndUpdate(
      {
        _id: id,
        $or: [
          { user: uid },
          { members: { $elemMatch: { user: uid, role: "editor" } } },
        ],
      },
      { description: String(description), notes: String(notes) },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Không tìm thấy dự án" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Members management (owner only)
export const listMembers = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: "ID không hợp lệ" });
    const project = await Project.findOne({ _id: id, user: req.userId }).populate(
      "members.user",
      "email name"
    );
    if (!project) return res.status(404).json({ message: "Không tìm thấy dự án" });
    res.json(project.members || []);
  } catch (e) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role = "viewer" } = req.body || {};
    if (!isValidId(id)) return res.status(400).json({ message: "ID không hợp lệ" });
    const memberUser = await User.findOne({
      email: String(email || "").trim().toLowerCase(),
    });
    if (!memberUser) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    const project = await Project.findOne({ _id: id, user: req.userId });
    if (!project) return res.status(404).json({ message: "Không tìm thấy dự án" });
    if (String(memberUser._id) === String(project.user)) {
      return res.status(400).json({ message: "Chủ dự án đã có toàn quyền" });
    }
    const exists = (project.members || []).some(
      (m) => String(m.user) === String(memberUser._id)
    );
    if (exists) return res.status(409).json({ message: "Đã chia sẻ người này" });
    project.members.push({
      user: memberUser._id,
      role: role === "editor" ? "editor" : "viewer",
    });
    await project.save();
    try {
      publish("project_members_changed", {
        projectId: project._id,
        memberId: memberUser._id,
        action: "added",
        role: role === "editor" ? "editor" : "viewer",
      });
    } catch {}
    res.status(201).json({
      user: { _id: memberUser._id, email: memberUser.email, name: memberUser.name },
      role: role === "editor" ? "editor" : "viewer",
    });
  } catch (e) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const { role } = req.body || {};
    if (!isValidId(id) || !isValidId(memberId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const project = await Project.findOne({ _id: id, user: req.userId });
    if (!project) return res.status(404).json({ message: "Không tìm thấy dự án" });
    const idx = (project.members || []).findIndex(
      (m) => String(m.user) === String(memberId)
    );
    if (idx === -1) return res.status(404).json({ message: "Không tìm thấy thành viên" });
    project.members[idx].role = role === "editor" ? "editor" : "viewer";
    await project.save();
    try {
      publish("project_members_changed", {
        projectId: project._id,
        memberId,
        action: "updated",
        role: project.members[idx].role,
      });
    } catch {}
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    if (!isValidId(id) || !isValidId(memberId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const project = await Project.findOne({ _id: id, user: req.userId });
    if (!project) return res.status(404).json({ message: "Không tìm thấy dự án" });
    project.members = (project.members || []).filter(
      (m) => String(m.user) !== String(memberId)
    );
    await project.save();
    try {
      publish("project_members_changed", {
        projectId: project._id,
        memberId,
        action: "removed",
      });
    } catch {}
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

