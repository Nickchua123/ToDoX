const sample = [
  { _id: "ORD-1001", status: "completed", items: [{}, {}], total: "1.250.000₫" },
  { _id: "ORD-1002", status: "shipping", items: [{}, {}, {}], total: "820.000₫" },
  { _id: "ORD-1003", status: "pending", items: [{}], total: "360.000₫" },
  { _id: "ORD-1004", status: "cancelled", items: [{}, {}], total: "—" },
];

export async function getOrders(status = "all") {
  try {
    const raw = localStorage.getItem("orders");
    const arr = raw ? JSON.parse(raw) : sample;
    return status === "all" ? arr : arr.filter((o) => o.status === status);
  } catch {
    return status === "all" ? sample : sample.filter((o) => o.status === status);
  }
}
