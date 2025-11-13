import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { listPayments, createPayment, updatePayment, deletePayment } from "../controllers/paymentController.js";
import { createVnpayPayment, verifyVnpayReturn } from "../controllers/vnpayController.js";

const router = express.Router();

router.post("/vnpay/create", requireAuth, createVnpayPayment);
router.get("/vnpay/verify", verifyVnpayReturn);

router.use(requireAuth, requireAdmin);

router.get("/", listPayments);
router.post("/", createPayment);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;
