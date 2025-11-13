import api from "@/lib/axios";
import { prepareCsrfHeaders } from "@/lib/csrf";

const statusMap = {
  shipping: "shipped",
  completed: "delivered",
};

export async function getOrders(status = "all", page = 1) {
  const params = new URLSearchParams();
  if (status && status !== "all") {
    params.set("status", statusMap[status] || status);
  }
  params.set("page", String(page));
  const query = params.toString();
  const { data } = await api.get(`/orders/mine${query ? `?${query}` : ""}`);
  if (Array.isArray(data)) {
    return { items: data, total: data.length, page: 1 };
  }
  return { items: data?.items || [], total: data?.total || 0, page: data?.page || 1 };
}

export async function cancelOrder(orderId, reason) {
  const headers = await prepareCsrfHeaders();
  const { data } = await api.post(
    `/orders/${orderId}/cancel`,
    reason ? { reason } : {},
    { headers }
  );
  return data;
}

export async function requestCancel(orderId, reason) {
  const headers = await prepareCsrfHeaders();
  const { data } = await api.post(
    `/orders/${orderId}/request-cancel`,
    reason ? { reason } : {},
    { headers }
  );
  return data;
}

export async function confirmDelivery(orderId) {
  const headers = await prepareCsrfHeaders();
  const { data } = await api.post(`/orders/${orderId}/confirm-delivery`, {}, { headers });
  return data;
}
