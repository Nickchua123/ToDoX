import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";
import {
  getMe,
  updateMe,
  listUsers,
  getUserById,
  updateUser,
  requestDeleteAccount,
  cancelDeleteAccount,
  createUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/me", getMe);
router.patch("/me", updateMe);
router.post("/delete-request", requestDeleteAccount);
router.post("/delete-cancel", cancelDeleteAccount);

router.route("/").get(requireAdmin, listUsers).post(requireAdmin, createUser);
router.get("/:userId", requireAdmin, getUserById);
router.patch("/:userId", requireAdmin, updateUser);
router.delete("/:userId", requireAdmin, deleteUser);

export default router;
