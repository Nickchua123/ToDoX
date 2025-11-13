import api from "@/lib/axios";
import { prepareCsrfHeaders } from "@/lib/csrf";

export const NOTIFICATIONS_EVENT = "notifications:updated";

const emitChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_EVENT));
  }
};

export async function fetchNotifications({ page = 1, limit = 10, unreadOnly = false } = {}) {
  const params = new URLSearchParams();
  params.set("page", page);
  params.set("limit", limit);
  if (unreadOnly) params.set("unreadOnly", "true");
  const { data } = await api.get(`/notifications?${params.toString()}`);
  return data;
}

export async function markNotificationRead(notificationId) {
  if (!notificationId) throw new Error("notificationId is required");
  const headers = await prepareCsrfHeaders();
  const { data } = await api.post(`/notifications/${notificationId}/read`, null, { headers });
  emitChange();
  return data;
}

export async function markAllNotificationsRead() {
  const headers = await prepareCsrfHeaders();
  const { data } = await api.post("/notifications/read-all", null, { headers });
  emitChange();
  return data;
}
