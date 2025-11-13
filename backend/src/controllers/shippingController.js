import {
  ghnAvailableServices,
  ghnCalculateFee,
  ghnCancelOrder,
  ghnCreateOrder,
  ghnGetDistricts,
  ghnGetOrderDetailByClientCode,
  ghnGetOrderFeeDetail,
  ghnGetProvinces,
  ghnGetWards,
} from "../services/ghnService.js";

export const listProvinces = async (req, res) => {
  try {
    const data = await ghnGetProvinces();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được tỉnh/thành", error: err.message });
  }
};

export const listDistricts = async (req, res) => {
  try {
    const { provinceId } = req.query;
    const data = await ghnGetDistricts(provinceId ? Number(provinceId) : undefined);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được quận/huyện", error: err.message });
  }
};

export const listWards = async (req, res) => {
  try {
    const { districtId } = req.query;
    if (!districtId) return res.status(400).json({ message: "districtId là bắt buộc" });
    const data = await ghnGetWards(Number(districtId));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được phường/xã", error: err.message });
  }
};

export const getAvailableServices = async (req, res) => {
  try {
    const { toDistrictId, fromDistrictId, shopId } = req.body || {};
    if (!toDistrictId) return res.status(400).json({ message: "Thiếu toDistrictId" });
    const services = await ghnAvailableServices({
      toDistrictId,
      fromDistrictId,
      shopId,
    });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được gói dịch vụ", error: err.message });
  }
};

export const calculateFee = async (req, res) => {
  try {
    const fee = await ghnCalculateFee(req.body || {});
    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: "Không tính được phí giao hàng", error: err.message });
  }
};

export const createShippingOrder = async (req, res) => {
  try {
    const result = await ghnCreateOrder(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Không tạo được vận đơn", error: err.message });
  }
};

export const cancelShippingOrder = async (req, res) => {
  try {
    const { orderCodes } = req.body || {};
    if (!Array.isArray(orderCodes) || orderCodes.length === 0) {
      return res.status(400).json({ message: "orderCodes là bắt buộc" });
    }
    const result = await ghnCancelOrder(orderCodes);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Không hủy được vận đơn", error: err.message });
  }
};

export const getOrderDetailByClientCode = async (req, res) => {
  try {
    const { clientOrderCode } = req.body || {};
    if (!clientOrderCode) return res.status(400).json({ message: "clientOrderCode là bắt buộc" });
    const result = await ghnGetOrderDetailByClientCode(clientOrderCode);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được thông tin vận đơn", error: err.message });
  }
};

export const getOrderFeeDetail = async (req, res) => {
  try {
    const { orderCode } = req.body || {};
    if (!orderCode) return res.status(400).json({ message: "orderCode là bắt buộc" });
    const result = await ghnGetOrderFeeDetail(orderCode);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Không lấy được chi tiết phí", error: err.message });
  }
};
