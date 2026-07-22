import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/stats", authMiddleware, getDashboardStats);

export default router;