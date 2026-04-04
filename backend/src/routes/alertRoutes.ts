import { Router } from "express";
import {
  registerAlert,
  triggerPriceDrop,
  getUserAlerts, // <-- Make sure to import this!
} from "../controllers/AlertController";

const router = Router();

router.get("/alerts/register", registerAlert);
router.get("/alerts/trigger", triggerPriceDrop);
router.get("/alerts/user/:email", getUserAlerts); // <-- The Dashboard needs this!

export default router;
