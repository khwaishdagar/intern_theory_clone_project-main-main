/**
 * Input Validation Middleware
 * Validates request body, params, and query parameters
 */

const validateRegister = (req, res, next) => {
  const { firstName, lastName, email, password, mobile, userType } = req.body;
  const errors = [];

  // Required fields validation
  if (!firstName || firstName.trim().length === 0) {
    errors.push("First name is required");
  } else if (firstName.trim().length < 2) {
    errors.push("First name must be at least 2 characters");
  }

  if (!lastName || lastName.trim().length === 0) {
    errors.push("Last name is required");
  } else if (lastName.trim().length < 2) {
    errors.push("Last name must be at least 2 characters");
  }

  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push("Invalid email format");
    }
  }

  if (!password || password.length === 0) {
    errors.push("Password is required");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (!mobile || mobile.trim().length === 0) {
    errors.push("Mobile number is required");
  } else {
    // Remove all non-digit characters and check length
    const cleanMobile = mobile.replace(/\D/g, "");
    // Accept 10 digits (standard) or 11 digits (with country code like 0 or 91)
    if (cleanMobile.length === 0) {
      errors.push("Mobile number must contain at least some digits");
    } else if (cleanMobile.length < 10) {
      errors.push(`Invalid mobile number format (minimum 10 digits required, got ${cleanMobile.length})`);
    } else if (cleanMobile.length > 11) {
      errors.push(`Invalid mobile number format (maximum 11 digits allowed, got ${cleanMobile.length})`);
    } else if (!/^[0-9]+$/.test(cleanMobile)) {
      errors.push("Invalid mobile number format (only digits allowed)");
    }
  }

  if (!userType || !["student", "company"].includes(userType)) {
    errors.push("User type must be either 'student' or 'company'");
  }

  // User type specific validation (only if provided)
  if (userType === "student") {
    if (req.body.city && req.body.city.trim().length > 0 && req.body.city.trim().length < 2) {
      errors.push("City must be at least 2 characters");
    }
  } else if (userType === "company") {
    if (req.body.companyName && req.body.companyName.trim().length > 0 && req.body.companyName.trim().length < 2) {
      errors.push("Company name must be at least 2 characters");
    }
  }

  if (errors.length > 0) {
    const logger = require("../utils/logger");
    logger.warn(`Registration validation failed: ${errors.join(", ")}`, {
      email: email,
      userType: userType,
      ip: req.ip
    });
    
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email format");
    }
  }

  if (!password || password.length === 0) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

const validateMongoId = (req, res, next) => {
  const mongoose = require("mongoose");
  const { id } = req.params;

  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  next();
};

const sanitizeInput = (req, res, next) => {
  // Sanitize string inputs
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key].trim();
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateMongoId,
  sanitizeInput,
};

