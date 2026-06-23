const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./utils/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Trust Vercel's proxy for rate limiting
app.set('trust proxy', 1);

// Middlewares
app.use(helmet());
app.use(cors()); // Allow all origins so any frontend Vercel URL can connect
app.use(express.json());
app.use(morgan('dev'));
app.use(generalLimiter);

// API Routes
app.get('/api', (req, res) => {
  res.json({ message: 'ProjectFlow API is running successfully!' });
});

// Temporary route to fix Neon database schema
app.get('/api/sync', async (req, res) => {
  try {
    const { sequelize } = require('./models');
    await sequelize.sync({ alter: true });
    res.json({ message: 'Database schema successfully updated and fixed!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
