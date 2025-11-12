import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import { getMe, updateMe, listUsers, getUserById, updateUser, requestDeleteAccount } from "../controllers/userController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/me", getMe);
router.patch("/me", updateMe);
router.post("/delete-request", requestDeleteAccount);

router.get("/", requireAdmin, listUsers);
router.get("/:userId", requireAdmin, getUserById);
router.patch("/:userId", requireAdmin, updateUser);

export default router;
