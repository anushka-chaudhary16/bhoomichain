require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const pool = require('../db');
const routes = require('../routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);

// Initialize DB and start server
const initializeDatabase = async () => {
  try {
    const seedSql = fs.readFileSync(
  path.join(__dirname, '../seed.sql'),
  'utf8'
   );
    console.log('Running seed.sql...');
    await pool.query(seedSql);
    console.log('Database tables created and seeded successfully.');
  } catch (err) {
    console.error('Database initialization failed:', err);
    throw err;
  }
};

module.exports = { app, initializeDatabase };