import api from "@/lib/axios";
import { prepareCsrfHeaders } from "@/lib/csrf";

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

export const getGhnServices = async (payload) => {
  const headers = await prepareCsrfHeaders();
  return api
    .post("/shipping/ghn/services", payload, { headers })
    .then((res) => res.data || []);
};

export const getGhnFee = async (payload) => {
  const headers = await prepareCsrfHeaders();
  return api
    .post("/shipping/ghn/fee", payload, { headers })
    .then((res) => res.data || {});
};

export const getGhnOrderDetail = async (clientOrderCode) => {
  const headers = await prepareCsrfHeaders();
  return api
    .post("/shipping/ghn/order-detail", { clientOrderCode }, { headers })
    .then((res) => res.data || {});
};
