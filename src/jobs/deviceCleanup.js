const cron = require('node-cron');
const deviceService = require('../services/deviceService');

// Run every hour to check for inactive devices
const startDeviceCleanupJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Running device cleanup job...');
      const deactivatedCount = await deviceService.deactivateInactiveDevices();
      console.log(`Device cleanup job completed. Deactivated ${deactivatedCount} devices.`);
    } catch (error) {
      console.error('Device cleanup job failed:', error);
    }
  });
};

module.exports = { startDeviceCleanupJob };