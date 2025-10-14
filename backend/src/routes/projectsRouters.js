import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { listProjects, createProject, renameProject, deleteProject } from "../controllers/projectsControllers.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", listProjects);
router.post("/", createProject);
router.put("/:id", renameProject);
router.delete("/:id", deleteProject);

export default router;

