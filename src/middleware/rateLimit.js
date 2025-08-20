const rateLimit = require('express-rate-limit');

const createRateLimit = (windowMs = 60000, max = 100, message = 'Too many requests') => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

const authLimiter = createRateLimit(900000, 10, 'Too many authentication attempts'); // 10 per 15 minutes
const generalLimiter = createRateLimit(60000, 100, 'Too many requests per minute'); // 100 per minute

module.exports = {
  authLimiter,
  generalLimiter
};