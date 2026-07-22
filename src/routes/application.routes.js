import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/application.controller.js";

const router = Router();




/**
 * Create Application
 * POST /api/applications
 */
router.post("/", authMiddleware, createApplication);

/**
 * Get All Applications
 * GET /api/applications
 */
router.get("/", authMiddleware, getApplications);

/**
 * Get Single Application
 * GET /api/applications/:id
 */
router.get("/:id", authMiddleware, getApplicationById);

/**
 * Update Application
 * PATCH /api/applications/:id
 */
router.patch("/:id", authMiddleware, updateApplication);

/**
 * Delete Application
 * DELETE /api/applications/:id
 */
router.delete("/:id", authMiddleware, deleteApplication);

export default router;