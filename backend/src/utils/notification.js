import Notification from "../models/Notification.js";

export const NotificationType = {
  ORDER: "order",
  PROMOTION: "promotion",
  SYSTEM: "system",
};

export async function createNotification({
  user,
  title,
  message = "",
  type = NotificationType.SYSTEM,
  data = {},
  isRead = false,
} = {}) {
  if (!user || !title) return null;
  try {
    const payload = {
      user,
      title: title.trim(),
      message: message?.trim ? message.trim() : message,
      type: Object.values(NotificationType).includes(type) ? type : NotificationType.SYSTEM,
      data,
      isRead,
      readAt: isRead ? new Date() : undefined,
    };
    return await Notification.create(payload);
  } catch (err) {
    console.error("[Notification] Không tạo được thông báo:", err.message);
    return null;
  }
}
