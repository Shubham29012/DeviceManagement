const DEVICE_TYPES = {
  LIGHT: 'light',
  THERMOSTAT: 'thermostat',
  CAMERA: 'camera',
  SMART_METER: 'smart_meter',
  SENSOR: 'sensor'
};

const DEVICE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance'
};

const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

const LOG_EVENTS = {
  UNITS_CONSUMED: 'units_consumed',
  TEMPERATURE_CHANGE: 'temperature_change',
  MOTION_DETECTED: 'motion_detected',
  STATUS_CHANGE: 'status_change'
};

module.exports = {
  DEVICE_TYPES,
  DEVICE_STATUS,
  USER_ROLES,
  LOG_EVENTS
};
