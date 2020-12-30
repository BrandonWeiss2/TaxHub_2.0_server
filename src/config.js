module.exports = {
  PORT: process.env.PORT || 8001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres@localhost/TaxHub-2.0',
  DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://postgres@localhost/TaxHub-test-2.0',
  JWT_SECRET: process.env.JWT_SECRET || 'mysecret',
}