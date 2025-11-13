import express from "express";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notificationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", listNotifications);
router.post("/read-all", markAllNotificationsRead);
router.post("/:notificationId/read", markNotificationRead);

export default router;
