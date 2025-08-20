const mongoose = require('mongoose');
const { LOG_EVENTS } = require('../utils/constants');

const deviceLogSchema = new mongoose.Schema({
  device_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: [true, 'Device ID is required']
  },
  event: {
    type: String,
    required: [true, 'Event type is required'],
    enum: Object.values(LOG_EVENTS)
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Event value is required']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: false
});

// Index for efficient queries
deviceLogSchema.index({ device_id: 1, timestamp: -1 });
deviceLogSchema.index({ device_id: 1, event: 1, timestamp: -1 });
module.exports=mongoose.model('DeviceLog',deviceLogSchema);