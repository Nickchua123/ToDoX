import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  cancelShippingOrder,
  calculateFee,
  createShippingOrder,
  getAvailableServices,
  getOrderDetailByClientCode,
  getOrderFeeDetail,
  listDistricts,
  listProvinces,
  listWards,
} from "../controllers/shippingController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/ghn/provinces", listProvinces);
router.get("/ghn/districts", listDistricts);
router.get("/ghn/wards", listWards);
router.post("/ghn/services", getAvailableServices);
router.post("/ghn/fee", calculateFee);
router.post("/ghn/create", createShippingOrder);
router.post("/ghn/cancel", cancelShippingOrder);
router.post("/ghn/order-detail", getOrderDetailByClientCode);
router.post("/ghn/order-fee", getOrderFeeDetail);

export default router;
