import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { logSession, getStats, getTaskCounts } from "../controllers/pomodoroControllers.js";

const router = express.Router();

router.post("/sessions", requireAuth, logSession);
router.get("/stats", requireAuth, getStats);
router.get("/task-counts", requireAuth, getTaskCounts);

export default router;

