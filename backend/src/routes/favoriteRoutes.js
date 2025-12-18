import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  addFavorite,
  listFavorites,
  removeFavorite,
} from "../controllers/favoriteController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", listFavorites);
router.post("/", addFavorite);
router.delete("/:productId", removeFavorite);

export default router;
