const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Device = require('../src/models/Device');

describe('Device Endpoints', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/smart-device-test');
  });

  beforeEach(async () => {
    // Clean up database
    await User.deleteMany({});
    await Device.deleteMany({});

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
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /devices', () => {
    it('should create a new device successfully', async () => {
      const deviceData = {
        name: 'Living Room Light',
        type: 'light',
        status: 'active'
      };

      const response = await request(app)
        .post('/devices')
        .set('Authorization', `Bearer ${authToken}`)
        .send(deviceData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.device.name).toBe(deviceData.name);
      expect(response.body.device.type).toBe(deviceData.type);
      expect(response.body.device.owner_id).toBe(userId);
    });

    it('should require authentication', async () => {
      const deviceData = {
        name: 'Living Room Light',
        type: 'light',
        status: 'active'
      };

      const response = await request(app)
        .post('/devices')
        .send(deviceData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should validate device data', async () => {
      const invalidDeviceData = {
        name: 'A', // Too short
        type: 'invalid_type'
      };

      const response = await request(app)
        .post('/devices')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidDeviceData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /devices', () => {
    beforeEach(async () => {
      // Create test devices
      const devices = [
        { name: 'Light 1', type: 'light', status: 'active', owner_id: userId },
        { name: 'Thermostat 1', type: 'thermostat', status: 'inactive', owner_id: userId }
      ];
      
      for (const device of devices) {
        await new Device(device).save();
      }
    });

    it('should return user devices', async () => {
      const response = await request(app)
        .get('/devices')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.devices).toHaveLength(2);
    });

    it('should filter devices by type', async () => {
      const response = await request(app)
        .get('/devices?type=light')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.devices).toHaveLength(1);
      expect(response.body.devices[0].type).toBe('light');
    });

    it('should filter devices by status', async () => {
      const response = await request(app)
        .get('/devices?status=active')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.devices).toHaveLength(1);
      expect(response.body.devices[0].status).toBe('active');
    });
  });
});
