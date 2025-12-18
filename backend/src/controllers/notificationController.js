import mongoose from "mongoose";
import Notification from "../models/Notification.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildPagination = (page = 1, limit = 10, maxLimit = 50) => {
  const perPage = Math.min(Math.max(parseInt(limit, 10) || 10, 1), maxLimit);
  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const skip = (pageNumber - 1) * perPage;
  return { perPage, pageNumber, skip };
};

export const listNotifications = async (req, res) => {
  try {
    const { unreadOnly, page = 1, limit = 10 } = req.query;
    const { perPage, pageNumber, skip } = buildPagination(page, limit);
    const query = { user: req.userId };
    if (String(unreadOnly) === "true") query.isRead = false;

    const [items, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),
      Notification.countDocuments(query),
      Notification.countDocuments({ user: req.userId, isRead: false }),
    ]);

    res.json({
      items,
      total,
      page: pageNumber,
      unreadCount,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không lấy được thông báo", error: err.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    if (!isValidObjectId(notificationId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: req.userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    if (!notification)
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    const unreadCount = await Notification.countDocuments({
      user: req.userId,
      isRead: false,
    });
    res.json({ notification, unreadCount });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không cập nhật được thông báo", error: err.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    res.json({ success: true, unreadCount: 0 });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Không cập nhật được thông báo", error: err.message });
  }
};
