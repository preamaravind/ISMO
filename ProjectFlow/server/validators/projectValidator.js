const { body } = require('express-validator');

const projectRules = [
  body('project_name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ min: 1, max: 200 }).withMessage('Project name must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['Not Started', 'In Progress', 'Completed'])
    .withMessage('Status must be one of: Not Started, In Progress, Completed'),
  body('start_date')
    .optional({ values: 'null' })
    .isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD)'),
  body('end_date')
    .optional({ values: 'null' })
    .isISO8601().withMessage('End date must be a valid date (YYYY-MM-DD)')
];

const projectUpdateRules = [
  body('project_name')
    .optional()
    .trim()
    .notEmpty().withMessage('Project name cannot be empty')
    .isLength({ min: 1, max: 200 }).withMessage('Project name must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['Not Started', 'In Progress', 'Completed'])
    .withMessage('Status must be one of: Not Started, In Progress, Completed'),
  body('start_date')
    .optional({ values: 'null' })
    .isISO8601().withMessage('Start date must be a valid date (YYYY-MM-DD)'),
  body('end_date')
    .optional({ values: 'null' })
    .isISO8601().withMessage('End date must be a valid date (YYYY-MM-DD)')
];

module.exports = { projectRules, projectUpdateRules };
