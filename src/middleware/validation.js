const Joi = require('joi');
const { DEVICE_TYPES, DEVICE_STATUS, USER_ROLES, LOG_EVENTS } = require('../utils/constants');

const validateSignup = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(...Object.values(USER_ROLES)).default(USER_ROLES.USER)
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  req.body = value;
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  req.body = value;
  next();
};

const validateDevice = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    type: Joi.string().valid(...Object.values(DEVICE_TYPES)).required(),
    status: Joi.string().valid(...Object.values(DEVICE_STATUS)).default(DEVICE_STATUS.ACTIVE),
    metadata: Joi.object().default({})
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  req.body = value;
  next();
};

const validateDeviceUpdate = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    status: Joi.string().valid(...Object.values(DEVICE_STATUS)).optional(),
    metadata: Joi.object().optional()
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  req.body = value;
  next();
};

const validateHeartbeat = (req, res, next) => {
  const schema = Joi.object({
    status: Joi.string().valid(...Object.values(DEVICE_STATUS)).optional()
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  req.body = value;
  next();
};

const validateDeviceLog = (req, res, next) => {
  const schema = Joi.object({
    event: Joi.string().valid(...Object.values(LOG_EVENTS)).required(),
    value: Joi.alternatives().try(Joi.number(), Joi.string(), Joi.object()).required(),
    metadata: Joi.object().default({})
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  req.body = value;
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateDevice,
  validateDeviceUpdate,
  validateHeartbeat,
  validateDeviceLog
};