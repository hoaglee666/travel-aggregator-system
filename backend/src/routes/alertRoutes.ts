import { Router } from "express";
import {
  registerAlert,
  triggerPriceDrop,
  getUserAlerts,
  deleteAlert,
  updatePriceAlert, // <-- 1. Make sure this is imported
} from "../controllers/AlertController";

const router = Router();

router.get("/alerts/register", registerAlert);
router.get("/alerts/trigger", triggerPriceDrop);
router.get("/alerts/user/:email", getUserAlerts);
router.delete("/alerts/:alertId", deleteAlert); // <-- 2. Make sure this line exists!
router.put("/:alertId", updatePriceAlert);
export default router;
