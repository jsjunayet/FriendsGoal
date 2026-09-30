import type { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

/**
 * 1. Authentication Rate Limiter: Max 5 login attempts per minute per IP
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts from this IP. Please try again in 1 minute.",
  },
});

/**
 * 2. Financial Mutations Rate Limiter: Max 10 requests per minute per IP
 */
export const financialMutationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many financial operations submitted from this IP. Please wait 1 minute before retrying.",
  },
});

/**
 * 3. NoSQL Injection Prevention Sanitizer
 * Recursively removes operators starting with '$' or containing '.' from inputs
 */
function cleanInPlace(obj: any): void {
  if (!obj || typeof obj !== "object") return;

  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      cleanInPlace(obj[key]);
    }
  }
}

export const sanitizeNoSql = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.body && typeof req.body === "object") {
    cleanInPlace(req.body);
  }
  if (req.query && typeof req.query === "object") {
    cleanInPlace(req.query);
  }
  if (req.params && typeof req.params === "object") {
    cleanInPlace(req.params);
  }
  next();
};
