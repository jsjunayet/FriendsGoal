import type { Request, Response, NextFunction } from "express";
/**
 * 1. Authentication Rate Limiter: Max 5 login attempts per minute per IP
 */
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * 2. Financial Mutations Rate Limiter: Max 10 requests per minute per IP
 */
export declare const financialMutationLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const sanitizeNoSql: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=security.d.ts.map