require('dotenv').config({ path: '../.env' });

const { app, initializeDatabase } = require('./app');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 BhoomiChain Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
})();