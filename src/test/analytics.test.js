const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Device = require('../src/models/Device');
const DeviceLog = require('../src/models/DeviceLog');

describe('Analytics Endpoints', () => {
  let authToken;
  let userId;
  let deviceId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/smart-device-test');
  });

  beforeEach(async () => {
    // Clean up database
    await User.deleteMany({});
    await Device.deleteMany({});
    await DeviceLog.deleteMany({});

    // Create and login user
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123'
    };
    
    await request(app).post('/auth/signup').send(userData);
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password });
    
    authToken = loginResponse.body.token;
    userId = loginResponse.body.user.id;

    // Create a test device
    const deviceResponse = await request(app)
      .post('/devices')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Smart Meter',
        type: 'smart_meter',
        status: 'active'
      });
    
    deviceId = deviceResponse.body.device.id;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /devices/:id/logs', () => {
    it('should create a device log successfully', async () => {
      const logData = {
        event: 'units_consumed',
        value: 2.5
      };

      const response = await request(app)
        .post(`/devices/${deviceId}/logs`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(logData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.log.event).toBe(logData.event);
      expect(response.body.log.value).toBe(logData.value);
    });

    it('should require valid device ownership', async () => {
      // Create another user
      const otherUserData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'SecurePass123'
      };
      
      await request(app).post('/auth/signup').send(otherUserData);
      const otherLoginResponse = await request(app)
        .post('/auth/login')
        .send({ email: otherUserData.email, password: otherUserData.password });
      
      const otherAuthToken = otherLoginResponse.body.token;

      const logData = {
        event: 'units_consumed',
        value: 2.5
      };

      const response = await request(app)
        .post(`/devices/${deviceId}/logs`)
        .set('Authorization', `Bearer ${otherAuthToken}`)
        .send(logData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /devices/:id/logs', () => {
    beforeEach(async () => {
      // Create test logs
      const logs = [
        { device_id: deviceId, event: 'units_consumed', value: 2.5 },
        { device_id: deviceId, event: 'units_consumed', value: 1.2 },
        { device_id: deviceId, event: 'units_consumed', value: 3.1 }
      ];
      
      for (const log of logs) {
        await new DeviceLog(log).save();
      }
    });

    it('should return device logs', async () => {
      const response = await request(app)
        .get(`/devices/${deviceId}/logs`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.logs).toHaveLength(3);
    });

    it('should limit number of logs returned', async () => {
      const response = await request(app)
        .get(`/devices/${deviceId}/logs?limit=2`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.logs).toHaveLength(2);
    });
  });

  describe('GET /devices/:id/usage', () => {
    beforeEach(async () => {
      // Create test logs for usage aggregation
      const logs = [
        { device_id: deviceId, event: 'units_consumed', value: 2.5 },
        { device_id: deviceId, event: 'units_consumed', value: 1.2 },
        { device_id: deviceId, event: 'units_consumed', value: 3.1 }
      ];
      
      for (const log of logs) {
        await new DeviceLog(log).save();
      }
    });

    it('should return aggregated usage data', async () => {
      const response = await request(app)
        .get(`/devices/${deviceId}/usage?range=24h`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.device_id).toBe(deviceId);
      expect(response.body.total_units_last_24h).toBe(6.8);
    });
  });
});