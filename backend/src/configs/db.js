const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const logger = require("../utils/logger");

require("dotenv").config();
mongoose.set("strictQuery", false);

let memoryServerInstance = null;
let cleanupHooksAttached = false;

const attachCleanupHooks = () => {
  if (cleanupHooksAttached) return;
  cleanupHooksAttached = true;

  const cleanup = async () => {
    try {
      await mongoose.connection.close(false);
    } catch (err) {
      logger.warn("⚠️ Error while closing mongoose connection during shutdown", {
        error: err.message,
      });
    }

    if (memoryServerInstance) {
      try {
        await memoryServerInstance.stop();
        logger.info("🧹 In-memory MongoDB instance stopped");
      } catch (err) {
        logger.warn("⚠️ Failed to stop in-memory MongoDB instance", {
          error: err.message,
        });
      }
    }
  };

  process.on("SIGINT", async () => {
    await cleanup();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await cleanup();
    process.exit(0);
  });

  process.on("exit", () => {
    if (memoryServerInstance) {
      memoryServerInstance.stop();
    }
  });
};

const connectWithUri = async (uri) => {
  const connection = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: Number(process.env.MONGO_SELECTION_TIMEOUT_MS) || 5000,
  });

  logger.info("✅ MongoDB connected successfully", {
    uri: uri.startsWith("mongodb+srv")
      ? "mongodb+srv://<redacted>"
      : uri.replace(/\/\/.*@/g, "//***:***@"),
  });

  attachCleanupHooks();
  return connection;
};

const shouldUseMemoryFallback = (error) => {
  if (!error) return false;
  const message = error.message ? error.message.toLowerCase() : "";

  return (
    error.code === "ECONNREFUSED" ||
    error.code === "ENOTFOUND" ||
    message.includes("ecconnrefused") ||
    message.includes("failed to connect") ||
    message.includes("connect econnrefused")
  );
};

const startMemoryServer = async () => {
  if (memoryServerInstance) {
    return memoryServerInstance.getUri();
  }

  const dbName = process.env.MONGO_INMEMORY_DBNAME || "intern_theory_inmemory";

  memoryServerInstance = await MongoMemoryServer.create({
    instance: {
      dbName,
    },
  });

  const uri = memoryServerInstance.getUri();
  process.env.MONGODB_URI = uri;

  logger.warn("⚠️ Falling back to in-memory MongoDB instance", {
    uri,
    dbName,
    note: "Data will be reset on every restart. Set ENABLE_INMEMORY_MONGO=false to disable.",
  });

  return uri;
};

module.exports = async () => {
  const allowMemoryFallback = process.env.ENABLE_INMEMORY_MONGO !== "false";
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri && !allowMemoryFallback) {
    throw new Error("MONGODB_URI is not defined and in-memory fallback is disabled.");
  }

  if (!mongoUri && allowMemoryFallback) {
    mongoUri = await startMemoryServer();
  }

  try {
    return await connectWithUri(mongoUri);
  } catch (error) {
    logger.error("❌ MongoDB connection error", {
      message: error.message,
      code: error.code,
    });

    if (!allowMemoryFallback || !shouldUseMemoryFallback(error)) {
      throw error;
    }

    const fallbackUri = await startMemoryServer();
    return await connectWithUri(fallbackUri);
  }
};
