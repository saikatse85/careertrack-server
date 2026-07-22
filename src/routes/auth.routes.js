import { Router } from "express";

import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post("/login", loginUser);

/**
 * @route GET /api/auth/me
 * @desc Get logged in user
 * @access Private
 */
router.get("/me", authMiddleware, getMe);

export default router;