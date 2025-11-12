import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import {
  listReviews,
  listAllReviews,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
  hideReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", listReviews);
router.get("/admin/all", requireAuth, requireAdmin, listAllReviews);
router.post("/", requireAuth, createReview);
router.put("/:id", requireAuth, updateReview);
router.delete("/:id", requireAuth, deleteReview);
router.patch("/:id/approve", requireAuth, requireAdmin, approveReview);
router.patch("/:id/hide", requireAuth, requireAdmin, hideReview);

export default router;
