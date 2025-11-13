import axios from "axios";

const GHN_API_BASE = process.env.GHN_API_BASE || "https://dev-online-gateway.ghn.vn/shiip/public-api";
const GHN_TOKEN = process.env.GHN_TOKEN;
const GHN_SHOP_ID = process.env.GHN_SHOP_ID;
const GHN_TIMEOUT = Number(process.env.GHN_TIMEOUT_MS || 15000);

const ghnClient = axios.create({
  baseURL: GHN_API_BASE,
  timeout: GHN_TIMEOUT,
});

const buildHeaders = (includeShopId = true, extra = {}) => {
  if (!GHN_TOKEN) {
    throw new Error("GHN_TOKEN chưa được cấu hình");
  }
  const headers = {
    Token: GHN_TOKEN,
    "Content-Type": "application/json",
    ...extra,
  };
  if (includeShopId && GHN_SHOP_ID) {
    headers.ShopId = GHN_SHOP_ID;
  }
  return headers;
};

const parseResponse = (response) => {
  const data = response?.data;
  if (data?.code && data.code !== 200) {
    const message = data?.message || data?.code_message_value || "GHN API error";
    throw new Error(message);
  }
  if (typeof data === "object" && data !== null && "data" in data) {
    return data.data;
  }
  return data;
};

const requestGHN = async (path, { method = "POST", data, params, includeShopId = true, headers = {} } = {}) => {
  const response = await ghnClient.request({
    url: path,
    method,
    data,
    params,
    headers: buildHeaders(includeShopId, headers),
  });
  return parseResponse(response);
};

let provinceCache = null;
let districtCache = new Map(); // provinceId -> array
let wardCache = new Map(); // districtId -> array

export const ghnGetProvinces = async () => {
  if (provinceCache) return provinceCache;
  const data = await requestGHN("/master-data/province", { method: "GET", includeShopId: false });
  provinceCache = data || [];
  return provinceCache;
};

export const ghnGetDistricts = async (provinceId) => {
  const key = provinceId ? Number(provinceId) : undefined;
  if (key && districtCache.has(key)) {
    return districtCache.get(key);
  }
  const payload = key ? { province_id: key } : undefined;
  const data = await requestGHN("/master-data/district", {
    method: payload ? "POST" : "GET",
    data: payload,
    includeShopId: false,
  });
  if (key) districtCache.set(key, data || []);
  return data || [];
};

export const ghnGetWards = async (districtId) => {
  if (!districtId) throw new Error("districtId là bắt buộc");
  const key = Number(districtId);
  if (wardCache.has(key)) return wardCache.get(key);
  const data = await requestGHN(`/master-data/ward`, {
    method: "POST",
    data: { district_id: key },
    includeShopId: false,
  });
  wardCache.set(key, data || []);
  return data || [];
};

export const ghnAvailableServices = async ({ toDistrictId, fromDistrictId, shopId }) => {
  const payload = {
    shop_id: Number(shopId || GHN_SHOP_ID),
    from_district: Number(fromDistrictId || process.env.GHN_FROM_DISTRICT_ID),
    to_district: Number(toDistrictId),
  };
  if (!payload.to_district) throw new Error("to_district là bắt buộc");
  return requestGHN("/v2/shipping-order/available-services", { data: payload });
};

export const ghnCalculateFee = async (payload = {}) => {
  const data = {
    service_type_id: payload.service_type_id,
    service_id: payload.service_id,
    from_district_id: Number(payload.from_district_id || process.env.GHN_FROM_DISTRICT_ID),
    to_district_id: Number(payload.to_district_id),
    to_ward_code: payload.to_ward_code,
    height: payload.height || 10,
    length: payload.length || 10,
    width: payload.width || 10,
    weight: payload.weight || 500,
    insurance_fee: payload.insurance_value || payload.insurance_fee || 0,
    insurance_value: payload.insurance_value || 0,
    coupon: payload.coupon || null,
    items: payload.items || [],
  };
  if (!data.to_district_id || !data.to_ward_code) {
    throw new Error("Thiếu to_district_id hoặc to_ward_code");
  }
  return requestGHN("/v2/shipping-order/fee", { data });
};

export const ghnCreateOrder = async (payload = {}) => {
  const data = {
    payment_type_id: payload.payment_type_id || 2,
    note: payload.note || "",
    required_note: payload.required_note || "KHONGCHOXEMHANG",
    return_phone: payload.return_phone || process.env.GHN_RETURN_PHONE || process.env.GHN_FROM_PHONE,
    return_address: payload.return_address || process.env.GHN_RETURN_ADDRESS || process.env.GHN_FROM_ADDRESS,
    return_district_id: payload.return_district_id || process.env.GHN_RETURN_DISTRICT_ID || process.env.GHN_FROM_DISTRICT_ID,
    return_ward_code: payload.return_ward_code || process.env.GHN_RETURN_WARD_CODE || process.env.GHN_FROM_WARD_CODE,
    client_order_code: payload.client_order_code,
    from_name: payload.from_name || process.env.GHN_FROM_NAME,
    from_phone: payload.from_phone || process.env.GHN_FROM_PHONE,
    from_address: payload.from_address || process.env.GHN_FROM_ADDRESS,
    from_ward_name: payload.from_ward_name || process.env.GHN_FROM_WARD_NAME,
    from_district_name: payload.from_district_name || process.env.GHN_FROM_DISTRICT_NAME,
    from_province_name: payload.from_province_name || process.env.GHN_FROM_PROVINCE_NAME,
    to_name: payload.to_name,
    to_phone: payload.to_phone,
    to_address: payload.to_address,
    to_ward_name: payload.to_ward_name,
    to_district_name: payload.to_district_name,
    to_province_name: payload.to_province_name,
    to_district_id: payload.to_district_id,
    to_ward_code: payload.to_ward_code,
    cod_amount: payload.cod_amount || 0,
    content: payload.content || "Hàng thời trang",
    height: payload.height || 10,
    length: payload.length || 10,
    width: payload.width || 10,
    weight: payload.weight || 500,
    cod_failed_amount: payload.cod_failed_amount || 0,
    pick_station_id: payload.pick_station_id || null,
    deliver_station_id: payload.deliver_station_id || null,
    insurance_value: payload.insurance_value || 0,
    service_type_id: payload.service_type_id,
    service_id: payload.service_id,
    coupon: payload.coupon || null,
    pickup_time: payload.pickup_time,
    pick_shift: payload.pick_shift || undefined,
    items: payload.items || [],
  };

  if (!data.to_name || !data.to_phone || !data.to_address) {
    throw new Error("Thiếu thông tin người nhận");
  }
  if (!data.to_district_id || !data.to_ward_code) {
    throw new Error("Thiếu mã quận/huyện hoặc phường/xã");
  }
  if (!data.service_type_id) {
    throw new Error("service_type_id là bắt buộc");
  }
  return requestGHN("/v2/shipping-order/create", { data });
};

export const ghnCancelOrder = async (orderCodes = []) => {
  if (!Array.isArray(orderCodes) || orderCodes.length === 0) {
    throw new Error("order_codes là bắt buộc");
  }
  return requestGHN("/v2/switch-status/cancel", { data: { order_codes: orderCodes } });
};

export const ghnGetOrderDetailByClientCode = async (clientOrderCode) => {
  if (!clientOrderCode) throw new Error("client_order_code là bắt buộc");
  return requestGHN("/v2/shipping-order/detail-by-client-code", {
    data: { client_order_code: clientOrderCode },
  });
};

export const ghnGetOrderFeeDetail = async (orderCode) => {
  if (!orderCode) throw new Error("order_code là bắt buộc");
  return requestGHN("/v2/shipping-order/soc", {
    data: { order_code: orderCode },
  });
};
