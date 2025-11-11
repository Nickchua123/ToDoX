import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getCart, addItem, updateItem, removeItem, clearCart } from "../controllers/cartController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getCart);
router.post("/items", addItem);
router.put("/items/:itemId", updateItem);
router.delete("/items/:itemId", removeItem);
router.delete("/", clearCart);

export default router;
