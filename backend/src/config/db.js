require("dotenv").config();
const { DataSource } = require("typeorm");

// Explicitly import the entity classes
const User = require("../entities/User");
const Claim = require("../entities/Claim");
const Comment = require("../entities/Comment");

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true, 
  logging: false,
  // Pass the actual classes so the Vercel bundler cannot lose the metadata
  entities: [User, Claim, Comment],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = AppDataSource;