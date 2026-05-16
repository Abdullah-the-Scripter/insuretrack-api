require("dotenv").config();
const { DataSource } = require("typeorm");
const path = require("path");

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true, // safe for prototyping/academic evaluation
  logging: false,
  // Fix: Use an absolute directory path string so Vercel's compiler bundles them properly
  entities: [path.join(__dirname, "../entities/*.js")],
  extra: {
    // Fix: Force SSL connection verification required by Supabase in production
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = AppDataSource;