import { ZodError } from "zod";

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // Zod Validation Error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors: err.flatten().fieldErrors,
    });
  }

  // Prisma Unique Constraint Error
  if (err.code === "P2002") {
    return res.status(409).json({
      success: false,
      message: "This record already exists.",
    });
  }

  // Prisma Record Not Found
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "Record not found.",
    });
  }

  // JWT Error
  if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }

  // Default Error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;