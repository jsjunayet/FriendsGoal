"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeNoSql = exports.financialMutationLimiter = exports.authLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * 1. Authentication Rate Limiter: Max 5 login attempts per minute per IP
 */
exports.authLimiter = (0, express_rate_limit_1.default)({
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
exports.financialMutationLimiter = (0, express_rate_limit_1.default)({
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
function cleanInPlace(obj) {
    if (!obj || typeof obj !== "object")
        return;
    for (const key of Object.keys(obj)) {
        if (key.startsWith("$") || key.includes(".")) {
            delete obj[key];
        }
        else if (typeof obj[key] === "object" && obj[key] !== null) {
            cleanInPlace(obj[key]);
        }
    }
}
const sanitizeNoSql = (req, _res, next) => {
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
exports.sanitizeNoSql = sanitizeNoSql;
//# sourceMappingURL=security.js.map