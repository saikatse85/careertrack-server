import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

import { generateToken } from "../utils/jwt.js";
import {
  registerSchema,
  loginSchema,
} from "../validations/auth.validation.js";

/**
 * @desc Register User
 * @route POST /api/auth/register
 */
export const registerUser = async (req, res,next) => {
  try {
    // Validate request body
    const data = registerSchema.parse(req.body);

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Zod Validation Error
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.flatten().fieldErrors,
      });
    }

    next(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * @desc Login User
 * @route POST /api/auth/login
 */
export const loginUser = async (req, res, next) => {
  try {
    // Validate request
    const data = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: error.flatten().fieldErrors,
      });
    }

    next(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * @desc Get Logged In User
 * @route GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};