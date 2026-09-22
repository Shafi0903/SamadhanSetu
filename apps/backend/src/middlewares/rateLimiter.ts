import rateLimit from "express-rate-limit";

/**
 * Strict rate limiter for authentication routes (login, OTP dispatch/verification, registration)
 * Prevents credential stuffing, brute force attacks, and SMS/OTP flooding.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 30, // Max 30 attempts per 15 min per IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too Many Requests",
    message: "Too many authentication attempts from this IP address. Please try again after 15 minutes.",
  },
});

/**
 * General rate limiter for all API endpoints to protect against volumetric Denial of Service (DoS)
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 500, // Generous threshold for interactive map / polling operations
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too Many Requests",
    message: "API rate limit exceeded. Please reduce request frequency.",
  },
});
