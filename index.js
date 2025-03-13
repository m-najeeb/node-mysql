require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sequelize = require("./database");
const setup = require("./api/routes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.options("*", cors()); // Handle preflight requests

// Rate Limiting (Prevents abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later",
});
app.use(limiter);

// Custom logger format
logger.token("status-format", (req, res) => {
  const status = res.statusCode;
  return status >= 200 && status < 300
    ? "🟢"
    : status >= 300 && status < 400
    ? "🔵"
    : "🔴";
});
app.use(logger(":method :url :status-format :status :response-time ms"));

// Test route
app.get("/", (req, res) => {
  res.send("Hello, Server is Up and Running!");
});

// MySQL connection check
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database Synced");
  } catch (error) {
    console.error("Database Sync Error:", error);
  }
})();

setup(app);

// Start server
app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});
