

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