import { Router } from "express";
import {
  registerAlert,
  triggerPriceDrop,
} from "../controllers/AlertController";

const router = Router();

router.get("/alerts/register", registerAlert);
router.get("/alerts/trigger", triggerPriceDrop);

export default router;
