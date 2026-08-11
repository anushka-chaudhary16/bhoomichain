require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const pool = require('./db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);

// Initialize DB and start server
const startServer = async () => {
  try {
    // Read and execute seed.sql
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql')).toString();
    console.log('Running seed.sql...');
    await pool.query(seedSql);
    console.log('Database tables created and seeded successfully.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
