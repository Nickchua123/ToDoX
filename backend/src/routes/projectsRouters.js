import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { listProjects, createProject, renameProject, deleteProject, getProject, updateProjectMeta } from "../controllers/projectsControllers.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", listProjects);
router.post("/", createProject);
router.put("/:id", renameProject);
router.delete("/:id", deleteProject);
router.get("/:id", getProject);
router.put("/:id/meta", updateProjectMeta);

export default router;

