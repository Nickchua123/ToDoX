import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import {
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from "../controllers/couponController.js";

const router = express.Router();

router.post("/validate", validateCoupon);

router.use(requireAuth, requireAdmin);

router.get("/", listCoupons);
router.post("/", createCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;
