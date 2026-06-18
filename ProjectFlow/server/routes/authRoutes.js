const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerRules, loginRules } = require('../validators/authValidator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/logout', auth, authController.logout);
router.get('/me', auth, authController.getMe);

module.exports = router;
