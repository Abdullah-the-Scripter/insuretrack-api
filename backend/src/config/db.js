require("dotenv").config();
const { DataSource } = require("typeorm");

const User = require("../entities/User");
const Claim = require("../entities/Claim");
const Comment = require("../entities/Comment");

const AppDataSource = new DataSource({
  type: "postgres",
  // Fix: Feed the complete Supabase URL string directly from your Vercel settings
  url: process.env.DATABASE_URL,
  synchronize: true, 
  logging: false,
  entities: [User, Claim, Comment],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = AppDataSource;