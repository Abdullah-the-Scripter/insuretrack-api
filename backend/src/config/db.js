require("dotenv").config();
const { DataSource } = require("typeorm");

const User = require("../entities/User");
const Claim = require("../entities/Claim");
const Comment = require("../entities/Comment");

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  // FIX: Disable synchronize over connection poolers to prevent session locking timeout crashes
  synchronize: false, 
  logging: false,
  entities: [User, Claim, Comment],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = AppDataSource;