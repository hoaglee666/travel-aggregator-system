import { Router } from "express";
import {
  getProfile,
  depositMoney,
  updateProfile,
} from "../controllers/ProfileController";

const router = Router();

// Assuming this router is mounted to '/api' in your server.ts
router.get("/profile/:email", getProfile);
router.post("/profile/deposit", depositMoney);

// ✅ NEW: The missing PUT route for saving edits
router.put("/profile/update", updateProfile);

export default router;
