import express from "express";
import {
  listVariants,
  createVariant,
  updateVariant,
  deleteVariant,
} from "../controllers/variantController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = express.Router();

router.get("/", requireAuth, requireAdmin, listVariants);
router.post("/", requireAuth, requireAdmin, createVariant);
router.put("/:id", requireAuth, requireAdmin, updateVariant);
router.delete("/:id", requireAuth, requireAdmin, deleteVariant);

export default router;
