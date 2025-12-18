import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", listAddresses);
router.post("/", createAddress);
router.put("/:id", updateAddress);
router.put("/:id/default", setDefaultAddress);
router.delete("/:id", deleteAddress);

export default router;
