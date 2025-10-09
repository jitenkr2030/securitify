# SecurityGuard Pro API Documentation

## Overview

The SecurityGuard Pro API provides a comprehensive RESTful interface for managing security guard operations, including real-time location tracking, attendance management, geofencing, alerts, and billing.

### Key Features

- **Real-time Location Tracking**: GPS-based location monitoring with geofencing capabilities
- **Attendance Management**: Automated check-in/checkout with facial recognition support
- **Alert System**: Real-time alerts for various security events
- **Multi-tenancy**: Support for multiple organizations with data isolation
- **Billing Integration**: Stripe-powered subscription management
- **Mobile Support**: Offline data synchronization for mobile applications
- **Comprehensive Monitoring**: Health checks, metrics, and alerting

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.securityguardpro.com/v1`

## Authentication

All API endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Getting Started

1. **Register/Login**: Use the authentication endpoints to obtain a JWT token
2. **Include Token**: Add the token to all subsequent API requests
3. **Refresh Token**: Use the refresh endpoint to obtain new tokens before expiration

## Rate Limiting

- **Default**: 100 requests per 15-minute window per IP address
- **Headers**: Rate limit information is included in response headers:
  - `X-RateLimit-Limit`: Maximum requests per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the window resets (Unix timestamp)

## Error Handling

All API endpoints return standardized error responses:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": {
    "field": "Additional error details"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or invalid
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## API Endpoints

### Monitoring Endpoints

#### Health Check
```http
GET /health?detailed=false
```

Returns the current health status of the system.

**Parameters:**
- `detailed` (boolean, optional): Return detailed health information

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 86400000,
  "checks": 3,
  "active_alerts": 0
}
```

#### System Metrics
```http
GET /metrics?name=&timeRange=1h
```

Retrieve system performance metrics.

**Parameters:**
- `name` (string, optional): Specific metric name
- `timeRange` (string, optional): Time range (1h, 24h, 7d)

**Response:**
```json
{
  "available_metrics": [
    "memory_usage_percent",
    "api_response_time",
    "database_latency"
  ],
  "system_metrics": {
    "uptime": 86400000,
    "memory": {
      "heapUsedMB": 128,
      "heapTotalMB": 512,
      "usagePercent": 25.0
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Authentication Endpoints

#### NextAuth.js Authentication
```http
GET /auth/[...nextauth]
POST /auth/[...nextauth]
```

Handles authentication callbacks and sessions. This endpoint is managed by NextAuth.js and supports various authentication providers.

### Guards Management

#### Get Guards
```http
GET /guards?status=ACTIVE&search=John&page=1&limit=10
```

Retrieve a list of guards with filtering and pagination.

**Parameters:**
- `status` (string, optional): Filter by status (ACTIVE, INACTIVE, ON_LEAVE, SUSPENDED)
- `search` (string, optional): Search by name or email
- `page` (integer, optional): Page number
- `limit` (integer, optional): Items per page

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "employeeId": "EMP001",
    "licenseNumber": "LIC123",
    "licenseExpiry": "2024-12-31",
    "photo": "https://example.com/photo.jpg",
    "status": "ACTIVE",
    "tenantId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Create Guard
```http
POST /guards
```

Create a new guard.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "employeeId": "EMP001",
  "licenseNumber": "LIC123",
  "licenseExpiry": "2024-12-31",
  "photo": "https://example.com/photo.jpg",
  "status": "ACTIVE"
}
```

### Alerts Management

#### Get Alerts
```http
GET /alerts?severity=HIGH&status=ACTIVE
```

Retrieve alerts with filtering.

**Parameters:**
- `severity` (string, optional): Filter by severity (LOW, MEDIUM, HIGH, CRITICAL)
- `status` (string, optional): Filter by status (ACTIVE, RESOLVED, DISMISSED)

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "GEOFENCE_BREACH",
    "message": "Guard breached geofence boundary",
    "severity": "HIGH",
    "status": "ACTIVE",
    "guardId": "uuid",
    "locationId": "uuid",
    "geofenceId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "guard": {
      "id": "uuid",
      "name": "John Doe",
      "phone": "+1234567890",
      "photo": "https://example.com/photo.jpg"
    },
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "timestamp": "2024-01-01T00:00:00.000Z"
    },
    "geofence": {
      "name": "Main Building",
      "radius": 100
    }
  }
]
```

#### Create Alert
```http
POST /alerts
```

Create a new alert.

**Request Body:**
```json
{
  "type": "GEOFENCE_BREACH",
  "message": "Guard breached geofence boundary",
  "severity": "HIGH",
  "guardId": "uuid",
  "locationId": "uuid",
  "geofenceId": "uuid"
}
```

### Geofences Management

#### Get Geofences
```http
GET /geofences
```

Retrieve all geofences.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Main Building",
    "description": "Main office building perimeter",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "radius": 100,
    "type": "CIRCLE",
    "isActive": true,
    "tenantId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Create Geofence
```http
POST /geofences
```

Create a new geofence.

**Request Body:**
```json
{
  "name": "Main Building",
  "description": "Main office building perimeter",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radius": 100,
  "type": "CIRCLE",
  "isActive": true
}
```

### Attendance Management

#### Get Attendance Records
```http
GET /attendance?guardId=uuid&startDate=2024-01-01&endDate=2024-01-31&type=CHECK_IN
```

Retrieve attendance records with filtering.

**Parameters:**
- `guardId` (string, optional): Filter by guard ID
- `startDate` (string, optional): Start date (YYYY-MM-DD)
- `endDate` (string, optional): End date (YYYY-MM-DD)
- `type` (string, optional): Filter by type (CHECK_IN, CHECK_OUT)

**Response:**
```json
[
  {
    "id": "uuid",
    "guardId": "uuid",
    "type": "CHECK_IN",
    "timestamp": "2024-01-01T09:00:00.000Z",
    "location": {
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "method": "GPS",
    "verificationScore": 0.95,
    "photo": "https://example.com/photo.jpg",
    "notes": "Regular check-in",
    "tenantId": "uuid",
    "createdAt": "2024-01-01T09:00:00.000Z"
  }
]
```

#### Create Attendance Record
```http
POST /attendance
```

Create a new attendance record.

**Request Body:**
```json
{
  "guardId": "uuid",
  "type": "CHECK_IN",
  "timestamp": "2024-01-01T09:00:00.000Z",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "method": "GPS",
  "verificationScore": 0.95,
  "photo": "https://example.com/photo.jpg",
  "notes": "Regular check-in"
}
```

### Billing Management

#### Get Subscription
```http
GET /billing/subscription
```

Retrieve current subscription information.

**Response:**
```json
{
  "id": "uuid",
  "tenantId": "uuid",
  "plan": "PROFESSIONAL",
  "status": "ACTIVE",
  "stripeSubscriptionId": "sub_xxxxxxxxxxxxxx",
  "currentPeriodStart": "2024-01-01T00:00:00.000Z",
  "currentPeriodEnd": "2024-02-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get Available Plans
```http
GET /billing/plans
```

Retrieve available subscription plans.

**Response:**
```json
[
  {
    "id": "basic",
    "name": "Basic",
    "description": "Essential features for small teams",
    "price": 29,
    "features": [
      "Up to 10 guards",
      "Basic location tracking",
      "Email support"
    ]
  },
  {
    "id": "professional",
    "name": "Professional",
    "description": "Advanced features for growing teams",
    "price": 99,
    "features": [
      "Up to 50 guards",
      "Advanced geofencing",
      "Priority support",
      "Custom reports"
    ]
  }
]
```

#### Create Checkout Session
```http
POST /billing/checkout
```

Create a Stripe checkout session.

**Request Body:**
```json
{
  "planId": "professional",
  "successUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/cancel"
}
```

**Response:**
```json
{
  "sessionId": "cs_xxxxxxxxxxxxxx",
  "url": "https://checkout.stripe.com/pay/cs_xxxxxxxxxxxxxx"
}
```

### Document Management

#### Get Documents
```http
GET /documents?guardId=uuid&type=CERTIFICATE&expiringSoon=true
```

Retrieve documents with filtering.

**Parameters:**
- `guardId` (string, optional): Filter by guard ID
- `type` (string, optional): Filter by document type
- `expiringSoon` (boolean, optional): Filter documents expiring soon

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Security License",
    "type": "CERTIFICATE",
    "fileUrl": "https://example.com/file.pdf",
    "fileSize": 1024000,
    "mimeType": "application/pdf",
    "guardId": "uuid",
    "tenantId": "uuid",
    "expiryDate": "2024-12-31",
    "isExpiringSoon": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Notifications

#### Get Notifications
```http
GET /notifications?unreadOnly=false&type=ALERT
```

Retrieve user notifications.

**Parameters:**
- `unreadOnly` (boolean, optional): Filter unread notifications only
- `type` (string, optional): Filter by notification type

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "ALERT",
    "title": "Geofence Breach",
    "message": "Guard breached Main Building geofence",
    "userId": "uuid",
    "isRead": false,
    "metadata": {
      "guardId": "uuid",
      "geofenceId": "uuid"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Mark Notifications as Read
```http
PATCH /notifications
```

Mark notifications as read.

**Request Body:**
```json
{
  "notificationIds": ["uuid1", "uuid2"]
}
```

**Response:**
```json
{
  "message": "Notifications marked as read successfully",
  "updatedCount": 2
}
```

### Tenant Management (Admin Only)

#### Get Tenants
```http
GET /tenants
```

Retrieve all tenants (admin only).

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Security Company Inc",
    "domain": "security-company",
    "settings": {
      "timezone": "UTC",
      "language": "en"
    },
    "subscription": {
      "id": "uuid",
      "plan": "PROFESSIONAL",
      "status": "ACTIVE"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Create Tenant
```http
POST /tenants
```

Create a new tenant (admin only).

**Request Body:**
```json
{
  "name": "Security Company Inc",
  "domain": "security-company",
  "settings": {
    "timezone": "UTC",
    "language": "en"
  }
}
```

## Webhooks

### Payment Webhook
```http
POST /payment/webhook
```

Handles Stripe webhook events for payment processing.

**Request Headers:**
- `Stripe-Signature`: Stripe signature for webhook verification

**Request Body:** Varies based on Stripe event type.

## Mobile API

### Offline Data Sync
```http
POST /mobile/offline-data
```

Synchronize offline data from mobile devices.

**Request Body:**
```json
{
  "deviceId": "uuid",
  "data": {
    "locations": [...],
    "attendance": [...],
    "alerts": [...]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Mobile Analytics
```http
GET /mobile/analytics?deviceId=uuid&startDate=2024-01-01&endDate=2024-01-31
```

Retrieve mobile app analytics.

**Parameters:**
- `deviceId` (string, optional): Filter by device ID
- `startDate` (string, optional): Start date
- `endDate` (string, optional): End date

## Best Practices

### Authentication
- Always include the JWT token in the Authorization header
- Refresh tokens before expiration
- Store tokens securely on client devices

### Error Handling
- Implement proper error handling for all API responses
- Use appropriate HTTP status codes
- Provide meaningful error messages to users

### Rate Limiting
- Implement exponential backoff for rate-limited requests
- Monitor rate limit headers
- Cache responses where appropriate

### Data Validation
- Validate all input data before sending requests
- Use appropriate data types and formats
- Handle validation errors gracefully

### Security
- Use HTTPS for all API requests
- Never expose sensitive data in client-side code
- Implement proper CORS policies

## SDKs and Libraries

### JavaScript/TypeScript
```javascript
import { SecurityGuardAPI } from '@securityguard/sdk';

const api = new SecurityGuardAPI({
  baseURL: 'https://api.securityguardpro.com/v1',
  token: 'your-jwt-token'
});

// Get guards
const guards = await api.guards.list({ status: 'ACTIVE' });

// Create alert
const alert = await api.alerts.create({
  type: 'GEOFENCE_BREACH',
  message: 'Guard breached boundary',
  severity: 'HIGH',
  guardId: 'guard-uuid'
});
```

### Python
```python
from securityguard_api import SecurityGuardAPI

api = SecurityGuardAPI(
    base_url='https://api.securityguardpro.com/v1',
    token='your-jwt-token'
)

# Get guards
guards = api.guards.list(status='ACTIVE')

# Create alert
alert = api.alerts.create(
    type='GEOFENCE_BREACH',
    message='Guard breached boundary',
    severity='HIGH',
    guard_id='guard-uuid'
)
```

## Support

For API support and questions:

- **Documentation**: https://securityguardpro.com/docs
- **API Status**: https://status.securityguardpro.com
- **Support Email**: api-support@securityguardpro.com
- **Community**: https://community.securityguardpro.com

## Changelog

### Version 1.0.0 (2024-01-01)
- Initial API release
- Core guard management features
- Location tracking and geofencing
- Attendance management
- Alert system
- Billing integration
- Multi-tenant support
- Mobile API endpoints