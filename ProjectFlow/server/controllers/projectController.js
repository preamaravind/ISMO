const { Op } = require('sequelize');
const { Project, Task } = require('../models');

// GET /api/projects — paginated, search, filter
const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;
    const { search, status } = req.query;

    const where = { user_id: userId };

    if (search) {
      where.project_name = { [Op.like]: `%${search}%` };
    }

    if (status) {
      where.status = status;
    }

    const { count, rows } = await Project.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [{
        model: Task,
        as: 'tasks',
        attributes: ['id', 'task_name', 'status', 'priority']
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
    console.error('GetProjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects: ' + (error.message || 'Unknown database error'),
      fullError: error
    });
  }
};

// GET /api/projects/:id
const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{
        model: Task,
        as: 'tasks',
        attributes: ['id', 'task_name', 'description', 'status', 'priority', 'due_date', 'created_at']
      }]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('GetProject error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project.'
    });
  }
};

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const { project_name, description, status, start_date, end_date } = req.body;

    const project = await Project.create({
      user_id: req.user.id,
      project_name,
      description,
      status,
      start_date,
      end_date
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: project
    });
  } catch (error) {
    console.error('CreateProject error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create project: ' + (error.message || 'Unknown database error'),
      fullError: error
    });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    const { project_name, description, status, start_date, end_date } = req.body;

    await project.update({
      project_name: project_name !== undefined ? project_name : project.project_name,
      description: description !== undefined ? description : project.description,
      status: status !== undefined ? status : project.status,
      start_date: start_date !== undefined ? start_date : project.start_date,
      end_date: end_date !== undefined ? end_date : project.end_date
    });

    res.json({
      success: true,
      message: 'Project updated successfully.',
      data: project
    });
  } catch (error) {
    console.error('UpdateProject error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update project.'
    });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.'
      });
    }

    await project.destroy();

    res.json({
      success: true,
      message: 'Project deleted successfully.'
    });
  } catch (error) {
    console.error('DeleteProject error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project.'
    });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
