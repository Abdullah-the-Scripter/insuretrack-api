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
  synchronize: true, 
  logging: false,
  entities: [path.join(__dirname, "../entities/*.js")],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = AppDataSource;