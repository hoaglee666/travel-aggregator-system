import { Router } from "express";
import { registerUser, loginUser } from "../controllers/AuthController";

const router = Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);

export default router;
