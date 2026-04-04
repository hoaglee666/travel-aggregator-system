import { Router } from "express";
import { getSystemLogs, getAllUsers } from "../controllers/AdminController";

const router = Router();

router.get("/admin/logs", getSystemLogs);
router.get("/admin/users", getAllUsers);

export default router;
