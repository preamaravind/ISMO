const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { taskRules, taskUpdateRules } = require('../validators/taskValidator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(auth);

router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTask);
router.post('/', taskRules, validate, taskController.createTask);
router.put('/:id', taskUpdateRules, validate, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
