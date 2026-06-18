const sequelize = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');

// User has many Projects
User.hasMany(Project, {
  foreignKey: 'user_id',
  as: 'projects',
  onDelete: 'CASCADE'
});
Project.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Project has many Tasks
Project.hasMany(Task, {
  foreignKey: 'project_id',
  as: 'tasks',
  onDelete: 'CASCADE'
});
Task.belongsTo(Project, {
  foreignKey: 'project_id',
  as: 'project'
});

module.exports = {
  sequelize,
  User,
  Project,
  Task
};
