import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { subscribe } from "../utils/sse.js";

const router = express.Router();

// Server-Sent Events subscription
router.get("/", requireAuth, (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  // Let proxies know this is a long-lived response
  res.flushHeaders?.();

  const unsubscribe = subscribe(res);
  req.on("close", unsubscribe);
});

export default router;

