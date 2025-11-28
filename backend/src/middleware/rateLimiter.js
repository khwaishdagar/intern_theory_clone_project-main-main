/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting the number of requests per IP
 */

const rateLimit = require("express-rate-limit");

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs (increased from 5)
  message: {
    success: false,
    message: "Too many authentication attempts, please try again after 15 minutes.",
  },
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Strict rate limiter for registration
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes (reduced from 1 hour for development)
  max: 10, // limit each IP to 10 registrations per 15 minutes (increased from 3 per hour)
  message: {
    success: false,
    message: "Too many registration attempts, please try again after 15 minutes.",
  },
  skipSuccessfulRequests: true, // Don't count successful registrations
});

module.exports = {
  apiLimiter,
  authLimiter,
  registerLimiter,
};

