require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import middlewares
const { errorHandler, notFound } = require("./src/middleware/errorHandler");
const { apiLimiter, authLimiter, registerLimiter } = require("./src/middleware/rateLimiter");
const { sanitizeInput } = require("./src/middleware/validation");
const logger = require("./src/utils/logger");

// Import controllers
const internshipController = require("./src/controllers/internship.controller");
const jobController = require("./src/controllers/job.controller");
const classroomController = require("./src/controllers/classroom.controller");
const onlineController = require("./src/controllers/online.controller");
const authController = require("./src/controllers/auth.controller");
const landingPageController = require("./src/controllers/landingPage.controller");
const contentController = require("./src/controllers/content.controller");
const seedController = require("./src/controllers/seed.controller");
const { seedDemoData } = require("./src/utils/demoSeeder");

/// Import database connection
const connect = require("./src/configs/db");

const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set("trust proxy", 1);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// --- ADD: normalize incoming mobile/phone fields before validation ---
app.use((req, res, next) => {
  try {
    const normalize = (val) => {
      if (!val && val !== 0) return val;
      let s = String(val).replace(/\D/g, "");            // keep digits only
      if (!s) return "";
      // remove leading zero(s) or common country code prefixes, then take last 10 digits
      // e.g. "08950832174" -> "8950832174", "+91xxxxxxxxxx" -> "xxxxxxxxxx"
      if (s.length > 10) s = s.slice(-10);
      return s;
    };

    if (req.body) {
      if (req.body.mobile) req.body.mobile = normalize(req.body.mobile);
      if (req.body.mobileNumber) req.body.mobileNumber = normalize(req.body.mobileNumber);
      if (req.body.phone) req.body.phone = normalize(req.body.phone);
      // optional: log normalization for debugging
      // logger.info('normalized mobile:', { mobile: req.body.mobile, mobileNumber: req.body.mobileNumber, phone: req.body.phone });
    }
  } catch (e) {
    // don't block request on normalization errors
    // logger.error('mobile normalization error', { err: e.message });
  }
  next();
});

// Sanitize input middleware (should be early in the chain)
app.use(sanitizeInput);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

// Health check endpoint (before rate limiting)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "InternTheory API is running",
    timestamp: new Date().toISOString(),
  });
});

// Apply rate limiting to all API routes
app.use("/api", apiLimiter);

// Routes with specific rate limiting
app.use("/api/auth/register", registerLimiter);
app.use("/api/auth/login", authLimiter);

// API Routes
app.use("/api/auth", authController);
app.use("/api/landing", landingPageController);
app.use("/api/content", contentController);
app.use("/api/seed", seedController);
app.use("/internship", internshipController);
app.use("/job", jobController);
app.use("/classroom", classroomController);
app.use("/online", onlineController);

// 404 handler (must be after all routes)
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const port = process.env.PORT || 5000;

const startServer = async () => {
  // Helper to attempt DB connect and return true or the error
  const tryConnect = async () => {
    try {
      await connect();
      return true;
    } catch (err) {
      return err;
    }
  };

  try {
    let result = await tryConnect();

    // If initial connect failed and looks like SRV/DNS issue, try fallback
    if (result !== true) {
      const err = result;
      const msg = (err && err.message) ? err.message : String(err);

      if (msg.includes("ENOTFOUND") || msg.includes("_mongodb._tcp") || msg.toLowerCase().includes("querysrv")) {
        logger.error(`❌ MongoDB SRV DNS lookup failed: ${msg}`);
        // If user used an atlas+srv string or cluster0 placeholder, try a local fallback
        const currentUri = process.env.MONGODB_URI || "";
        const fallback = process.env.FALLBACK_MONGODB_URI || "mongodb://127.0.0.1:27017/intern_theory_db";

        if (currentUri.startsWith("mongodb+srv") || currentUri.includes("cluster0") || !currentUri) {
          logger.info(`ℹ️ Retrying DB connection using fallback MONGODB_URI: ${fallback}`);
          process.env.MONGODB_URI = fallback;
          result = await tryConnect();
        }
      }
    }

    if (result !== true) {
      // Still not connected — throw original error if present, else generic
      const finalErr = (result && result.message) ? result : new Error("Failed to connect to MongoDB");
      throw finalErr;
    }

    // Start listening only after successful DB connection
    app.listen(port, async () => {
      logger.info(`🚀 Server running on port ${port}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
      logger.info(`🌐 API URL: http://localhost:${port}`);

      if ((process.env.AUTO_SEED_DEMO || "true").toLowerCase() !== "false") {
        try {
          await seedDemoData();
          logger.info("✅ Demo data ready");
        } catch (seedError) {
          logger.warn("⚠️ Demo data seeding skipped", { error: seedError.message });
        }
      }
    });
  } catch (error) {
    // Provide actionable guidance for common connection errors
    const msg = error && (error.message || error.toString());
    logger.error(`❌ Failed to start server: ${msg}`);

    // Specific guidance for local Mongo not running
    if (error && (error.code === "ECONNREFUSED" || (msg && msg.includes("ECONNREFUSED")))) {
      logger.error("🔍 Reason: Could not connect to MongoDB at 127.0.0.1:27017 (connection refused).");
      logger.error("⚙️ Fix options:");
      logger.error("  1) Start local MongoDB:");
      logger.error('     - If installed as service on Windows: open Services (services.msc) and start "MongoDB" or run: net start MongoDB');
      logger.error('     - Or run mongod manually: "mongod --dbpath /path/to/data/db"');
      logger.error('  2) Start MongoDB via Docker: docker run -d -p 27017:27017 --name mongo mongo:6');
      logger.error('  3) Use MongoDB Atlas: set MONGODB_URI in backend/.env to the Atlas connection string (mongodb+srv://...) and ensure network access.');
      logger.error('  After fixing, restart the app: cd backend && npm start');
    } else {
      // For other errors, show message and exit
      logger.error("If this is an SRV/DNS error, verify your MONGODB_URI or set a local MongoDB and update backend/.env.");
    }

    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;

