const { Op } = require('sequelize');
const { Task, Project } = require('../models');

// GET /api/tasks — paginated, search, filter by status/priority/project
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;
    const { search, status, priority, project_id } = req.query;

    // Build the task where clause
    const taskWhere = {};
    if (search) {
      taskWhere.task_name = { [Op.like]: `%${search}%` };
    }
    if (status) {
      taskWhere.status = status;
    }
    if (priority) {
      taskWhere.priority = priority;
    }
    if (project_id) {
      taskWhere.project_id = project_id;
    }

    // Only tasks belonging to projects owned by the current user
    const { count, rows } = await Task.findAndCountAll({
      where: taskWhere,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [{
        model: Project,
        as: 'project',
        attributes: ['id', 'project_name', 'status'],
        where: { user_id: userId },
        required: true
      }]
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('GetTasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks.'
    });
  }
};

// GET /api/tasks/:id
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id },
      include: [{
        model: Project,
        as: 'project',
        attributes: ['id', 'project_name', 'user_id', 'status'],
        where: { user_id: req.user.id },
        required: true
      }]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('GetTask error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task.'
    });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { project_id, task_name, description, priority, status, due_date } = req.body;

    // Verify the project belongs to the current user
    const project = await Project.findOne({
      where: { id: project_id, user_id: req.user.id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or you do not have access to it.'
      });
    }

    const task = await Task.create({
      project_id,
      task_name,
      description,
      priority,
      status,
      due_date
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: task
    });
  } catch (error) {
    console.error('CreateTask error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create task.'
    });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    // Find task and verify ownership through project
    const task = await Task.findOne({
      where: { id: req.params.id },
      include: [{
        model: Project,
        as: 'project',
        where: { user_id: req.user.id },
        required: true
      }]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.'
      });
    }

    const { project_id, task_name, description, priority, status, due_date } = req.body;

    // If changing project_id, verify the new project also belongs to the user
    if (project_id && project_id !== task.project_id) {
      const newProject = await Project.findOne({
        where: { id: project_id, user_id: req.user.id }
      });
      if (!newProject) {
        return res.status(404).json({
          success: false,
          message: 'Target project not found or you do not have access to it.'
        });
      }
    }

    await task.update({
      project_id: project_id !== undefined ? project_id : task.project_id,
      task_name: task_name !== undefined ? task_name : task.task_name,
      description: description !== undefined ? description : task.description,
      priority: priority !== undefined ? priority : task.priority,
      status: status !== undefined ? status : task.status,
      due_date: due_date !== undefined ? due_date : task.due_date
    });

    res.json({
      success: true,
      message: 'Task updated successfully.',
      data: task
    });
  } catch (error) {
    console.error('UpdateTask error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update task.'
    });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id },
      include: [{
        model: Project,
        as: 'project',
        where: { user_id: req.user.id },
        required: true
      }]
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.'
      });
    }

    await task.destroy();

    res.json({
      success: true,
      message: 'Task deleted successfully.'
    });
  } catch (error) {
    console.error('DeleteTask error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task.'
    });
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
