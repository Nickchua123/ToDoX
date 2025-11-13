import express from "express";
import {
  createOrder,
  listMyOrders,
  listOrders,
  getOrderDetail,
  updateOrderStatus,
  cancelOrder,
  requestCancelOrder,
  confirmOrderDelivery,
} from "../controllers/orderController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = express.Router();

router.use(requireAuth);

router.get("/mine", listMyOrders);
router.post("/", createOrder);
router.get("/", requireAdmin, listOrders);
router.get("/:orderId", getOrderDetail);
router.patch("/:orderId/status", requireAdmin, updateOrderStatus);
router.post("/:orderId/cancel", cancelOrder);
router.post("/:orderId/request-cancel", requestCancelOrder);
router.post("/:orderId/confirm-delivery", confirmOrderDelivery);

export default router;
