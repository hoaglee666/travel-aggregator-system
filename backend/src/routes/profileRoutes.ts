import { Router } from "express";
import { getProfile, depositMoney } from "../controllers/ProfileController";

const router = Router();

router.get("/profile/:email", getProfile);
router.post("/profile/deposit", depositMoney);

export default router;
