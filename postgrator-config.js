require('dotenv').config();

module.exports = {
  migrationDirectory: "migrations",
  driver: "pg",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database:
    process.env.NODE_ENV === "test"
      ? process.env.TEST_DATABASE_NAME
      : process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
};