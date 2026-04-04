import { Router } from "express";
import { trackAndRedirect } from "../controllers/RedirectController";

const router = Router();

// Notice this is a GET request, so a standard browser link can trigger it
router.get("/redirect", trackAndRedirect);

export default router;
