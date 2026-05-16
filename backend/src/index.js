require("dotenv").config();
require("reflect-metadata");

const express = require("express");
const cors = require("cors");

const AppDataSource = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/claims", require("./routes/claimRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Error Handler
app.use(errorHandler);

// Initialize Database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected securely");

    // LOCAL TESTING ONLY: Vercel does not use app.listen
    if (process.env.NODE_ENV !== "production") {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Local server running on port ${PORT}`);
      });
    }
  })
  .catch((err) => console.log("Database connection error:", err));

// CRITICAL FOR VERCEL: Export the raw Express app
module.exports = app;