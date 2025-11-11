import express from "express";
import {
  listPublicBanners,
  listAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = express.Router();

router.get("/", listPublicBanners);
router.get("/manage", requireAuth, requireAdmin, listAllBanners);
router.post("/", requireAuth, requireAdmin, createBanner);
router.put("/:id", requireAuth, requireAdmin, updateBanner);
router.delete("/:id", requireAuth, requireAdmin, deleteBanner);

export default router;
