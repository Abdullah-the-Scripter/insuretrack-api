require("dotenv").config();
require("reflect-metadata");

const express = require("express");
const cors = require("cors");

// --- FIX: Point imports into the src/ folder ---
const AppDataSource = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

// --- PRODUCTION CORS CONFIGURATION ---
const allowedOrigins = [
  "https://insuretrack-api-1kid.vercel.app", 
  "http://localhost:5173",                   
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
}));

app.options('*', cors());

app.use(express.json());

// --- FIX: Point route imports into the src/ folder ---
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/claims", require("./src/routes/claimRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));

// Error Handler
app.use(errorHandler);

// Initialize Database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected securely");

    if (process.env.NODE_ENV !== "production") {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Local server running on port ${PORT}`);
      });
    }
  })
  .catch((err) => console.log("Database connection error:", err));

module.exports = app;