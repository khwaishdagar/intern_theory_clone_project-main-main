const express = require("express");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { validateRegister, validateLogin } = require("../middleware/validation");
const { asyncHandler } = require("../middleware/errorHandler");
const logger = require("../utils/logger");

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  
  return jwt.sign({ userId }, secret, {
    expiresIn,
  });
};

// Register User
router.post("/register", validateRegister, asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, mobile, userType, city, qualification, companyName, companyAddress } = req.body;

  // Clean and normalize data
  const cleanEmail = email.trim().toLowerCase();
  const cleanMobile = mobile.replace(/\D/g, "");

  // Check if user already exists
  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    logger.warn(`Registration attempt with existing email: ${cleanEmail}`);
    return res.status(400).json({ 
      success: false,
      message: "User with this email already exists",
      errors: ["This email is already registered. Please login instead."]
    });
  }

  // Create user object
  const userData = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: cleanEmail,
    password,
    mobile: cleanMobile,
    userType,
  };

  // Add user type specific fields
  if (userType === "student") {
    if (city) userData.city = city;
    if (qualification) userData.qualification = qualification;
  } else if (userType === "company") {
    if (companyName) userData.companyName = companyName;
    if (companyAddress) userData.companyAddress = companyAddress;
  }

  // Create new user
  const user = await User.create(userData);

  // Generate token
  const token = generateToken(user._id);

  // Return user data (without password)
  const userResponse = user.toObject();
  delete userResponse.password;

  logger.info(`New user registered: ${email} (${userType})`);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: userResponse,
  });
}));

// Login User
router.post("/login", validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    logger.warn(`Failed login attempt: ${email} (user not found)`);
    return res.status(401).json({ 
      success: false,
      message: "Invalid email or password" 
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    logger.warn(`Failed login attempt: ${email} (invalid password)`);
    return res.status(401).json({ 
      success: false,
      message: "Invalid email or password" 
    });
  }

  // Generate token
  const token = generateToken(user._id);

  // Return user data (without password)
  const userResponse = user.toObject();
  delete userResponse.password;

  logger.info(`User logged in: ${email} (${user.userType})`);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: userResponse,
  });
}));

// Get Current User (Protected Route)
router.get("/me", asyncHandler(async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    logger.error("JWT_SECRET not configured");
    return res.status(500).json({ 
      success: false,
      message: "Server configuration error" 
    });
  }
  
  const decoded = jwt.verify(token, secret);
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: "User not found" 
    });
  }

  res.status(200).json({ 
    success: true,
    user 
  });
}));

module.exports = router;

