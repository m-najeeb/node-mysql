require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

// const setup = require("./api/routes");
const mySqlDb = require("./database");

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Sanitize MongoDB queries
app.use(cors()); // Enable CORS
app.options("*", cors()); // Handle preflight requests
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Custom logger format
logger.token("status-format", (req, res) => {
  const status = res.statusCode;
  if (status >= 200 && status < 300) {
    return "🟢"; // Success
  } else if (status >= 300 && status < 400) {
    return "🔵"; // Redirect
  } else {
    return "🔴"; // Error
  }
});
app.use(logger(":method :url :status-format :status :response-time ms"));

// Test route
app.get("/", (req, res) => {
  res.send("Hello, Server is Up and Running!");
});

// MySQL connection

mySqlDb
  .query("SELECT 1")
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((error) => {
    console.error("DB Connection Error:", error);
    process.exit(1);
  });

// Setup routes
// setup(app);

// Start server
app.listen(port, () => {
  console.log(`Server Running on port http://localhost:${port}`);
});
