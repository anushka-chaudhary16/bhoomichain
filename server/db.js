const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'bhoomi',
  password: process.env.DB_PASSWORD || 'bhoomi123',
  database: process.env.DB_NAME || 'bhoomichain',
});

module.exports = pool;
