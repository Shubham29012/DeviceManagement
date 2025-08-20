const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimit');

router.post('/signup', authLimiter, validateSignup, authController.signup);
router.post('/login', authLimiter, validateLogin, authController.login);

module.exports = router;
