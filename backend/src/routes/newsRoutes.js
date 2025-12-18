import express from "express";
import {
  listNews,
  getNews,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = express.Router();

router.get("/", listNews);
router.get("/:id", getNews);
router.post("/", requireAuth, requireAdmin, createNews);
router.put("/:id", requireAuth, requireAdmin, updateNews);
router.delete("/:id", requireAuth, requireAdmin, deleteNews);

export default router;
