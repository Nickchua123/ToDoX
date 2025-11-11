import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { listReviews, createReview, updateReview, deleteReview } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", listReviews);
router.post("/", requireAuth, createReview);
router.put("/:id", requireAuth, updateReview);
router.delete("/:id", requireAuth, deleteReview);

export default router;
