
## 🔧 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### POST /auth/signup
Create a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

#### POST /auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "u1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Device Management Endpoints

> **Note:** All device endpoints require authentication header: `Authorization: Bearer <token>`

#### POST /devices
Register a new device.

**Request:**
```json
{
  "name": "Living Room Light",
  "type": "light",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "device": {
    "id": "d1",
    "name": "Living Room Light",
    "type": "light",
    "status": "active",
    "last_active_at": null,
    "owner_id": "u1"
  }
}
```

#### GET /devices
List all devices with optional filtering.

**Query Parameters:**
- `type`: Filter by device type (light, thermostat, camera, smart_meter, sensor)
- `status`: Filter by status (active, inactive, maintenance)

**Response:**
```json
{
  "success": true,
  "devices": [
    {
      "id": "d1",
      "name": "Living Room Light",
      "type": "light",
      "status": "active",
      "last_active_at": "2025-08-17T10:15:30Z",
      "owner_id": "u1"
    }
  ]
}
```

#### PATCH /devices/:id
Update device details.

**Request:**
```json
{
  "name": "Updated Living Room Light",
  "status": "inactive"
}
```

#### DELETE /devices/:id
Remove a device.

**Response:**
```json
{
  "success": true,
  "message": "Device deleted successfully"
}
```

#### POST /devices/:id/heartbeat
Update device's last active timestamp.

**Request:**
```json
{
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device heartbeat recorded",
  "last_active_at": "2025-08-17T10:15:30Z"
}
```

### Analytics Endpoints

#### POST /devices/:id/logs
Create a log entry for a device.

**Request:**
```json
{
  "event": "units_consumed",
  "value": 2.5
}
```

**Response:**
```json
{
  "success": true,
  "log": {
    "id": "l1",
    "event": "units_consumed",
    "value": 2.5,
    "timestamp": "2025-08-17T08:00:00Z"
  }
}
```

#### GET /devices/:id/logs
Fetch device logs.

**Query Parameters:**
- `limit`: Number of logs to return (default: 10)

**Response:**
```json
{
  "success": true,
  "logs": [
    {
      "id": "l1",
      "event": "units_consumed",
      "value": 2.5,
      "timestamp": "2025-08-17T08:00:00Z"
    },
    {
      "id": "l2",
      "event": "units_consumed",
      "value": 1.2,
      "timestamp": "2025-08-17T09:00:00Z"
    }
  ]
}
```

#### GET /devices/:id/usage
Get aggregated usage data.

**Query Parameters:**
- `range`: Time range (1h, 24h, 7d, 30d) - default: 24h

**Response:**
```json
{
  "success": true,
  "device_id": "d2",
  "total_units_last_24h": 15.7
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: 
  - General: 100 requests per minute per user
  - Auth: 10 attempts per 15 minutes
- **Input Validation**: Joi schema validation
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configurable cross-origin resource sharing

## 📊 Background Jobs

### Device Cleanup Job
- **Schedule**: Runs every hour
- **Function**: Automatically deactivates devices inactive for >24 hours
- **Status**: Devices with `last_active_at` older than 24 hours are set to `inactive`

## 🗄️ Database Schema

### Users Collection
```javascript
{
  name: String (required, max: 100)
  email: String (required, unique, validated)
  password: String (required, min: 6, hashed)
  role: String (enum: ['user', 'admin'], default: 'user')
  createdAt: Date
  lastLogin: Date
}
```

### Devices Collection
```javascript
{
  name: String (required, max: 100)
  type: String (enum: ['light', 'thermostat', 'camera', 'smart_meter', 'sensor'])
  status: String (enum: ['active', 'inactive', 'maintenance'])
  owner_id: ObjectId (ref: User)
  last_active_at: Date
  metadata: Mixed (flexible data storage)
  createdAt: Date
  updatedAt: Date
}
```

### Device Logs Collection
```javascript
{
  device_id: ObjectId (ref: Device)
  event: String (enum: ['units_consumed', 'temperature_change', 'motion_detected', 'status_change'])
  value: Mixed (flexible value storage)
  timestamp: Date (default: now)
  metadata: Mixed
}
```

## 📈 Performance Optimizations

- **Database Indexes**: Optimized queries with proper indexing
- **Connection Pooling**: MongoDB connection pooling
- **Error Handling**: Comprehensive error handling and logging
- **Validation**: Early request validation to prevent unnecessary processing
- **Logging**: Winston logger for production-grade logging

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**
```env
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
MONGODB_URI=<production-mongodb-url>
```

2. **Security**
   - Change default JWT secret
   - Use HTTPS in production
   - Configure proper CORS origins
   - Set up MongoDB authentication

3. **Monitoring**
   - Set up log aggregation
   - Configure health check endpoints
   - Monitor database performance

### Docker Production Deployment

```bash
# Build production image
docker build -t smart-device-platform:prod .

# Run with production environment
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration Options

### Rate Limiting
```javascript
// Configure in middleware/rateLimit.js
const generalLimiter = createRateLimit(
  60000,  // Window: 1 minute
  100,    // Max requests per window
  'Too many requests per minute'
);
```

### JWT Configuration
```javascript
// Token expiration
JWT_EXPIRES_IN=7d  // 7 days

// Custom secret (production)
JWT_SECRET=your-256-bit-secret
```

## 🛠️ Development

### Code Structure Guidelines

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and data processing
- **Models**: Database schemas and validations
- **Middleware**: Authentication, validation, rate limiting
- **Utils**: Shared utilities and constants

### Adding New Features

1. **Create Model** (if needed)
2. **Add Service Layer** with business logic
3. **Create Controller** for request handling
4. **Add Routes** with proper middleware
5. **Write Tests** for all layers
6. **Update Documentation**

## 📝 API Testing with Postman

Import the provided Postman collection (`postman/Smart_Device_API.postman_collection.json`) to test all endpoints.

**Collection Features:**
- Pre-configured environment variables
- Automatic token management
- Sample requests for all endpoints
- Test scripts for response validation

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check if MongoDB is running
   docker ps | grep mongo
   
   # Check connection string
   echo $MONGODB_URI
   ```

2. **JWT Token Invalid**
   ```bash
   # Verify JWT_SECRET is set
   echo $JWT_SECRET
   
   # Check token in request headers
   Authorization: Bearer <your-token>
   ```

3. **Rate Limit Exceeded**
   ```bash
   # Wait for rate limit window to reset
   # Or adjust limits in middleware/rateLimit.js
   ```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [JWT.io](https://jwt.io/)
- [Jest Testing Framework](https://jestjs.io/)

---

## 📋 Project Assumptions

1. **Device Ownership**: Each device belongs to one user
2. **Authentication**: JWT tokens expire after 7 days by default
3. **Rate Limiting**: Applied per IP address
4. **Background Jobs**: Run in-process (consider external job queue for production scale)
5. **Logging**: File-based logging (consider centralized logging for production)
6. **Database**: Single MongoDB instance (consider replica sets for production)

For questions or support, please create an issue in the repository.-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

A comprehensive backend system for managing IoT devices with user authentication, device management, and analytics capabilities.

##  Features

- **User Management**: Registration, authentication with JWT tokens
- **Device Management**: CRUD operations, heartbeat monitoring, automatic cleanup
- **Analytics**: Device logging, usage analytics, data aggregation
- **Security**: Rate limiting, input validation, secure password hashing
- **Background Jobs**: Automatic device deactivation for inactive devices
- **Docker Support**: Containerized deployment with Docker Compose
- **Comprehensive Testing**: Unit tests with Jest and Supertest

##  Architecture

```
src/
├── controllers/     # Request handlers
├── models/         # Database schemas
├── middleware/     # Authentication, validation, rate limiting
├── routes/         # API route definitions
├── services/       # Business logic layer
├── utils/          # Database, logging, constants
├── jobs/           # Background job schedulers
└── app.js          # Application entry point
```

##  Prerequisites

- Node.js (v18 or higher)
- MongoDB (v7.0 or higher)
- Docker & Docker Compose (optional)

## ⚡ Quick Start

### Option 1: Local Development

1. **Clone and Install**
```bash
git clone <repository-url>
cd smart-device-platform
npm install
```

2. **Environment Setup**
Create `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/
JWT_SECRET=your-super