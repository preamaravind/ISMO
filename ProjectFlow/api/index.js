const app = require('../server/app');
const { sequelize } = require('../server/models');

// Authenticate database (Sequelize handles connection pooling)
// For serverless, we avoid doing heavy schema syncs on every request
sequelize.authenticate()
  .then(() => console.log('Database connected successfully in serverless environment.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Export the Express app as a serverless function handler
module.exports = app;
