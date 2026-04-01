import { Router } from "express";
import { searchHotels } from "../controllers/SearchControllers";

const router = Router();

// Define the GET endpoint
router.get("/search", searchHotels);

export default router;
