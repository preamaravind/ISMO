const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  project_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Project name is required' },
      len: { args: [1, 200], msg: 'Project name must be between 1 and 200 characters' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed'),
    defaultValue: 'Not Started',
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isAfterStart(value) {
        if (value && this.start_date && new Date(value) < new Date(this.start_date)) {
          throw new Error('End date must be after start date');
        }
      }
    }
  }
}, {
  tableName: 'projects'
});

module.exports = Project;
