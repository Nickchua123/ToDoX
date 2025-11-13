import api from "@/lib/axios";

export const getProvinces = () =>
  api.get("/shipping/ghn/provinces").then((res) => res.data || []);

export const getDistricts = (provinceId) =>
  api
    .get("/shipping/ghn/districts", { params: { provinceId } })
    .then((res) => res.data || []);

export const getWards = (districtId) =>
  api
    .get("/shipping/ghn/wards", { params: { districtId } })
    .then((res) => res.data || []);

export const getGhnServices = (payload) =>
  api.post("/shipping/ghn/services", payload).then((res) => res.data || []);

export const getGhnFee = (payload) =>
  api.post("/shipping/ghn/fee", payload).then((res) => res.data || {});

export const getGhnOrderDetail = (clientOrderCode) =>
  api
    .post("/shipping/ghn/order-detail", { clientOrderCode })
    .then((res) => res.data || {});
