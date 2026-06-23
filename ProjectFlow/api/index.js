const app = require('../server/app');
const { sequelize } = require('../server/models');

// Sync database to ensure tables are created in the Neon Postgres DB
// CREATE TABLE IF NOT EXISTS is safe to run in serverless
sequelize.sync()
  .then(() => console.log('Database synced successfully in serverless environment.'))
  .catch(err => console.error('Unable to sync the database:', err));

// Export the Express app as a serverless function handler
module.exports = app;
