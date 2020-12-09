module.exports = {
  PORT: 8001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/taxhub-2.0',
  TEST_DB_URL: process.env.TEST_DB_URL || 'postgresql://postgres@localhost/taxhub-test-2.0',
  JWT_SECRET: process.env.JWT_SECRET || 'mysecret',
}