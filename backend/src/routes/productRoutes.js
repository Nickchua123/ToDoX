import express from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  removeProduct,
} from "../controllers/productController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = express.Router();

router.get("/", listProducts);
router.get("/:idOrSlug", getProduct);
router.post("/", requireAuth, requireAdmin, createProduct);
router.put("/:id", requireAuth, requireAdmin, updateProduct);
router.delete("/:id", requireAuth, requireAdmin, removeProduct);

export default router;
