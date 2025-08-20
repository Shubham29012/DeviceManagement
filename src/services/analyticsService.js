const DeviceLog = require('../models/DeviceLog');
const Device = require('../models/Device');
const moment = require('moment');

class AnalyticsService {
  async createDeviceLog(deviceId, userId, logData) {
    try {
      // Verify device ownership
      const device = await Device.findOne({ _id: deviceId, owner_id: userId });
      if (!device) {
        throw new Error('Device not found or access denied');
      }

      const deviceLog = new DeviceLog({
        device_id: deviceId,
        ...logData
      });
      await deviceLog.save();

      console.log(`Device log created for device ${deviceId}`);
      return { success: true, log: deviceLog };
    } catch (error) {
      console.error('Create device log error:', error);
      throw error;
    }
  }

  async getDeviceLogs(deviceId, userId, limit = 10) {
    try {
      // Verify device ownership
      const device = await Device.findOne({ _id: deviceId, owner_id: userId });
      if (!device) {
        throw new Error('Device not found or access denied');
      }

      const logs = await DeviceLog.find({ device_id: deviceId })
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .select('event value timestamp metadata');

      return {
        success: true,
        logs: logs.map(log => ({
          id: log._id,
          event: log.event,
          value: log.value,
          timestamp: log.timestamp,
          metadata: log.metadata
        }))
      };
    } catch (error) {
      console.error('Get device logs error:', error);
      throw error;
    }
  }

  async getDeviceUsage(deviceId, userId, range = '24h') {
    try {
      // Verify device ownership
      const device = await Device.findOne({ _id: deviceId, owner_id: userId });
      if (!device) {
        throw new Error('Device not found or access denied');
      }

      const now = moment();
      let startTime;

      switch (range) {
        case '1h':
          startTime = now.subtract(1, 'hour');
          break;
        case '24h':
          startTime = now.subtract(24, 'hours');
          break;
        case '7d':
          startTime = now.subtract(7, 'days');
          break;
        case '30d':
          startTime = now.subtract(30, 'days');
          break;
        default:
          startTime = now.subtract(24, 'hours');
      }

      // Aggregate units consumed for smart meters
      const result = await DeviceLog.aggregate([
        {
          $match: {
            device_id: deviceId,
            event: 'units_consumed',
            timestamp: { $gte: startTime.toDate() }
          }
        },
        {
          $group: {
            _id: null,
            total_units: { $sum: '$value' },
            count: { $sum: 1 }
          }
        }
      ]);

      const totalUnits = result.length > 0 ? result[0].total_units : 0;

      return {
        success: true,
        device_id: deviceId,
        [`total_units_last_${range}`]: totalUnits
      };
    } catch (error) {
      console.error('Get device usage error:', error);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();