const Device = require('../models/Device');
const mongoose = require('mongoose');

class DeviceService {
  async createDevice(deviceData, userId) {
    try {
      const device = new Device({
        ...deviceData,
        owner_id: userId
      });
      await device.save();

      console.log(`New device created: ${device.name} by user ${userId}`);
      return {
        success: true,
        device: {
          id: device._id,
          name: device.name,
          type: device.type,
          status: device.status,
          last_active_at: device.last_active_at,
          owner_id: device.owner_id
        }
      };
    } catch (error) {
      console.error('Create device error:', error);
      throw error;
    }
  }

  async getDevices(userId, filters = {}) {
    try {
      const query = { owner_id: userId };
      
      if (filters.type) query.type = filters.type;
      if (filters.status) query.status = filters.status;

      const devices = await Device.find(query)
        .populate('owner_id', 'name email')
        .sort({ createdAt: -1 });

      return { success: true, devices };
    } catch (error) {
      console.error('Get devices error:', error);
      throw error;
    }
  }

  async updateDevice(deviceId, userId, updateData) {
    try {
      const device = await Device.findOneAndUpdate(
        { _id: deviceId, owner_id: userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!device) {
        throw new Error('Device not found or access denied');
      }

      console.log(`Device updated: ${deviceId} by user ${userId}`);
      return { success: true, device };
    } catch (error) {
      console.error('Update device error:', error);
      throw error;
    }
  }

  async deleteDevice(deviceId, userId) {
    try {
      const device = await Device.findOneAndDelete({
        _id: deviceId,
        owner_id: userId
      });

      if (!device) {
        throw new Error('Device not found or access denied');
      }

      console.log(`Device deleted: ${deviceId} by user ${userId}`);
      return { success: true, message: 'Device deleted successfully' };
    } catch (error) {
      console.error('Delete device error:', error);
      throw error;
    }
  }

  async recordHeartbeat(deviceId, userId, statusUpdate = {}) {
    try {
      const updateData = {
        last_active_at: new Date(),
        ...statusUpdate
      };

      const device = await Device.findOneAndUpdate(
        { _id: deviceId, owner_id: userId },
        updateData,
        { new: true }
      );

      if (!device) {
        throw new Error('Device not found or access denied');
      }

      return {
        success: true,
        message: 'Device heartbeat recorded',
        last_active_at: device.last_active_at
      };
    } catch (error) {
      console.error('Heartbeat error:', error);
      throw error;
    }
  }

  async deactivateInactiveDevices() {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const result = await Device.updateMany(
        {
          last_active_at: { $lt: oneDayAgo },
          status: { $ne: 'inactive' }
        },
        { status: 'inactive' }
      );

      console.log(`Deactivated ${result.modifiedCount} inactive devices`);
      return result.modifiedCount;
    } catch (error) {
      console.error('Deactivate inactive devices error:', error);
      throw error;
    }
  }
}

module.exports = new DeviceService();