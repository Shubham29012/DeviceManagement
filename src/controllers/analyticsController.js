const analyticsService = require('../services/analyticsService');

class AnalyticsController {
  async createDeviceLog(req, res) {
    try {
      const result = await analyticsService.createDeviceLog(req.params.id, req.user._id, req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getDeviceLogs(req, res) {
    try {
      const limit = req.query.limit || 10;
      const result = await analyticsService.getDeviceLogs(req.params.id, req.user._id, limit);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getDeviceUsage(req, res) {
    try {
      const range = req.query.range || '24h';
      const result = await analyticsService.getDeviceUsage(req.params.id, req.user._id, range);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AnalyticsController();