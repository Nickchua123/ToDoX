import api from "@/lib/axios";

export async function getOrders(status = "all") {
  const { data } = await api.get("/orders/mine");
  if (status === "all") return data;
  return (data || []).filter((order) => order.status === status);
}
