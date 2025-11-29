import api from "@/lib/axios";

export const getAvailableCoupons = () =>
  api.get("/coupons/available").then((res) => res.data || []);

