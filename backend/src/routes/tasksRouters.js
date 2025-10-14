import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers/tasksControllers.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All task routes require authentication
router.use(requireAuth);

router.get("/", getAllTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
