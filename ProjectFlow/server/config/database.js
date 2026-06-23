const { Sequelize } = require('sequelize');

// Use Vercel Postgres URL, generic DATABASE_URL, or fallback to local SQLite
const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;

let sequelize;

if (dbUrl) {
  // Use PostgreSQL in production
  sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    dialectModule: require('pg'),
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for some hosted Postgres like Neon/Vercel
      }
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });
} else {
  // Fallback to SQLite for local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });
}

module.exports = sequelize;
