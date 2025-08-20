const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateuser } = require('../middleware/auth');
const { validateDeviceLog } = require('../middleware/validation');

router.use(authenticateuser);

router.post('/devices/:id/logs', validateDeviceLog, analyticsController.createDeviceLog);
router.get('/devices/:id/logs', analyticsController.getDeviceLogs);
router.get('/devices/:id/usage', analyticsController.getDeviceUsage);

module.exports = router;
