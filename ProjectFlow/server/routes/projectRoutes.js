const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { projectRules, projectUpdateRules } = require('../validators/projectValidator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(auth);

router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);
router.post('/', projectRules, validate, projectController.createProject);
router.put('/:id', projectUpdateRules, validate, projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
