const { Project, Task } = require('../models');
const { fn, col, literal } = require('sequelize');

// GET /api/dashboard/stats
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total projects count
    const totalProjects = await Project.count({
      where: { user_id: userId }
    });

    // Projects by status
    const projectsByStatus = await Project.findAll({
      where: { user_id: userId },
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Get all project IDs for this user
    const userProjectIds = await Project.findAll({
      where: { user_id: userId },
      attributes: ['id'],
      raw: true
    });
    const projectIds = userProjectIds.map((p) => p.id);

    let totalTasks = 0;
    let tasksByStatus = [];
    let tasksByPriority = [];
    let overdueTasks = 0;

    if (projectIds.length > 0) {
      // Total tasks count
      totalTasks = await Task.count({
        where: { project_id: projectIds }
      });

      // Tasks by status
      tasksByStatus = await Task.findAll({
        where: { project_id: projectIds },
        attributes: [
          'status',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['status'],
        raw: true
      });

      // Tasks by priority
      tasksByPriority = await Task.findAll({
        where: { project_id: projectIds },
        attributes: [
          'priority',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['priority'],
        raw: true
      });

      // Overdue tasks (due_date < today and not completed)
      overdueTasks = await Task.count({
        where: {
          project_id: projectIds,
          status: { [require('sequelize').Op.ne]: 'Completed' },
          due_date: { [require('sequelize').Op.lt]: new Date() }
        }
      });
    }

    // Format status/priority maps for convenience
    const formatGrouped = (rows, key) => {
      const result = {};
      rows.forEach((row) => {
        result[row[key]] = parseInt(row.count, 10);
      });
      return result;
    };

    res.json({
      success: true,
      data: {
        totalProjects,
        totalTasks,
        overdueTasks,
        projectsByStatus: formatGrouped(projectsByStatus, 'status'),
        tasksByStatus: formatGrouped(tasksByStatus, 'status'),
        tasksByPriority: formatGrouped(tasksByPriority, 'priority')
      }
    });
  } catch (error) {
    console.error('GetStats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats.'
    });
  }
};

module.exports = { getStats };
