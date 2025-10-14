import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { listProjects, createProject, renameProject, deleteProject, getProject, updateProjectMeta, listMembers, addMember, updateMember, removeMember } from "../controllers/projectsControllers.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", listProjects);
router.post("/", createProject);
router.put("/:id", renameProject);
router.delete("/:id", deleteProject);
router.get("/:id", getProject);
router.put("/:id/meta", updateProjectMeta);
// sharing endpoints (owner only)
router.get("/:id/members", listMembers);
router.post("/:id/members", addMember);
router.put("/:id/members/:memberId", updateMember);
router.delete("/:id/members/:memberId", removeMember);

export default router;

