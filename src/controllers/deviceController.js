const deviceService = require('../services/deviceService');

class DeviceController {
  async createDevice(req, res) {
    try {
      const result = await deviceService.createDevice(req.body, req.user._id);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getDevices(req, res) {
    try {
      const filters = {
        type: req.query.type,
        status: req.query.status
      };
      const result = await deviceService.getDevices(req.user._id, filters);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateDevice(req, res) {
    try {
      const result = await deviceService.updateDevice(req.params.id, req.user._id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteDevice(req, res) {
    try {
      const result = await deviceService.deleteDevice(req.params.id, req.user._id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async recordHeartbeat(req, res) {
    try {
      const result = await deviceService.recordHeartbeat(req.params.id, req.user._id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new DeviceController();