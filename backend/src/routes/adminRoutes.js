import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { getAdminSummary } from "../controllers/adminController.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/summary", getAdminSummary);

export default router;
