const { body } = require('express-validator');

const taskRules = [
  body('project_id')
    .notEmpty().withMessage('Project ID is required')
    .isInt({ min: 1 }).withMessage('Project ID must be a valid integer'),
  body('task_name')
    .trim()
    .notEmpty().withMessage('Task name is required')
    .isLength({ min: 1, max: 200 }).withMessage('Task name must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be one of: Low, Medium, High'),
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Status must be one of: Pending, In Progress, Completed'),
  body('due_date')
    .optional({ values: 'null' })
    .isISO8601().withMessage('Due date must be a valid date (YYYY-MM-DD)')
];

const taskUpdateRules = [
  body('project_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Project ID must be a valid integer'),
  body('task_name')
    .optional()
    .trim()
    .notEmpty().withMessage('Task name cannot be empty')
    .isLength({ min: 1, max: 200 }).withMessage('Task name must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be one of: Low, Medium, High'),
  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed'])
    .withMessage('Status must be one of: Pending, In Progress, Completed'),
  body('due_date')
    .optional({ values: 'null' })
    .isISO8601().withMessage('Due date must be a valid date (YYYY-MM-DD)')
];

module.exports = { taskRules, taskUpdateRules };
