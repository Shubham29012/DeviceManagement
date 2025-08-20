const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { authenticateuser } = require('../middleware/auth');
const { validateDevice, validateDeviceUpdate, validateHeartbeat } = require('../middleware/validation');

router.use(authenticateuser);

router.post('/adddevice', validateDevice, deviceController.createDevice);
router.get('/', deviceController.getDevices);
router.patch('/:id', validateDeviceUpdate, deviceController.updateDevice);
router.delete('/:id', deviceController.deleteDevice);
router.post('/:id/heartbeat', validateHeartbeat, deviceController.recordHeartbeat);

module.exports = router;
